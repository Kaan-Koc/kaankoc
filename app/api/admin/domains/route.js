import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const DOMAINS = ['kaankoc.com', 'kaankoc.net'];

// Simple WHOIS-like check using DNS and fallback methods
async function checkDomainStatus(domain) {
    try {
        // Use a free WHOIS JSON API
        const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_free&domainName=${domain}&outputFormat=JSON`);

        if (!response.ok) {
            // Fallback: just check if domain resolves
            const dnsCheck = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
            const dnsData = await dnsCheck.json();

            return {
                domain,
                status: dnsData.Answer ? 'active' : 'available',
                expirationDate: null,
                registrationDate: null,
                registrar: 'Unknown',
                daysRemaining: null,
                lastChecked: new Date().toISOString()
            };
        }

        const data = await response.json();
        const whoisRecord = data.WhoisRecord;

        if (!whoisRecord || whoisRecord.dataError) {
            throw new Error('Domain not found or WHOIS data unavailable');
        }

        const expirationDate = whoisRecord.expiresDate || whoisRecord.registryData?.expiresDate;
        const registrationDate = whoisRecord.createdDate || whoisRecord.registryData?.createdDate;

        let daysRemaining = null;
        if (expirationDate) {
            const expDate = new Date(expirationDate);
            const today = new Date();
            daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
        }

        return {
            domain,
            status: whoisRecord.domainAvailability === 'UNAVAILABLE' ? 'active' : 'available',
            expirationDate,
            registrationDate,
            registrar: whoisRecord.registrarName || 'Unknown',
            daysRemaining,
            lastChecked: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error checking ${domain}:`, error);
        return {
            domain,
            status: 'error',
            error: error.message,
            lastChecked: new Date().toISOString()
        };
    }
}

export async function GET(request) {
    try {
        const ctx = getRequestContext();
        const env = ctx?.env || {};
        const portfolioKV = env.PORTFOLIO_DATA;

        // Check cache first
        let results = [];
        const useCache = new URL(request.url).searchParams.get('cache') !== 'false';

        if (useCache && portfolioKV) {
            // Try to get cached results
            const cached = await Promise.all(
                DOMAINS.map(domain => portfolioKV.get(`domain_status_${domain}`))
            );

            if (cached.every(c => c !== null)) {
                results = cached.map(c => JSON.parse(c));
                return NextResponse.json({ domains: results, cached: true });
            }
        }

        // Fetch fresh data
        results = await Promise.all(DOMAINS.map(checkDomainStatus));

        // Cache results for 24 hours
        if (portfolioKV) {
            await Promise.all(
                results.map(result =>
                    portfolioKV.put(
                        `domain_status_${result.domain}`,
                        JSON.stringify(result),
                        { expirationTtl: 86400 } // 24 hours
                    )
                )
            );

            // Update last check timestamp
            await portfolioKV.put('domain_last_check', new Date().toISOString());
        }

        return NextResponse.json({ domains: results, cached: false });
    } catch (error) {
        console.error('Domain check error:', error);
        return NextResponse.json({ error: 'Failed to check domains' }, { status: 500 });
    }
}
