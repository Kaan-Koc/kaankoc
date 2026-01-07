import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const DOMAINS = ['kaankoc.com', 'kaankoc.net'];

// RDAP endpoints for different TLDs
const RDAP_SERVERS = {
    'com': 'https://rdap.verisign.com/com/v1/domain/',
    'net': 'https://rdap.verisign.com/net/v1/domain/',
    'org': 'https://rdap.org/domain/',
};

function getRdapUrl(domain) {
    const tld = domain.split('.').pop().toLowerCase();
    const baseUrl = RDAP_SERVERS[tld] || `https://rdap.org/domain/`;
    return `${baseUrl}${domain}`;
}

async function checkDomainWithRDAP(domain) {
    try {
        const rdapUrl = getRdapUrl(domain);
        console.log(`Checking domain ${domain} via RDAP: ${rdapUrl}`);

        const response = await fetch(rdapUrl, {
            headers: {
                'Accept': 'application/rdap+json',
            },
        });

        if (!response.ok) {
            // If RDAP fails, try DNS check as fallback
            console.log(`RDAP failed for ${domain}, trying DNS fallback`);
            return await checkDomainFallback(domain);
        }

        const data = await response.json();

        // Parse RDAP response
        const events = data.events || [];
        const registrationEvent = events.find(e => e.eventAction === 'registration');
        const expirationEvent = events.find(e => e.eventAction === 'expiration');
        const lastUpdateEvent = events.find(e => e.eventAction === 'last changed');

        const status = data.status || [];
        const isActive = status.some(s => s.includes('active') || s.includes('ok'));
        const isExpired = status.some(s => s.includes('expired'));

        const registrar = data.entities?.find(e => e.roles?.includes('registrar'));
        const registrarName = registrar?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Unknown';

        const expirationDate = expirationEvent?.eventDate;
        const registrationDate = registrationEvent?.eventDate;

        let daysRemaining = null;
        if (expirationDate) {
            const expDate = new Date(expirationDate);
            const today = new Date();
            daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
        }

        return {
            domain,
            status: isExpired ? 'expired' : (isActive ? 'active' : 'unknown'),
            expirationDate,
            registrationDate,
            lastUpdate: lastUpdateEvent?.eventDate,
            registrar: registrarName,
            daysRemaining,
            nameservers: data.nameservers?.map(ns => ns.ldhName) || [],
            statusCodes: status,
            lastChecked: new Date().toISOString(),
            source: 'RDAP'
        };
    } catch (error) {
        console.error(`RDAP error for ${domain}:`, error);
        return await checkDomainFallback(domain);
    }
}

async function checkDomainFallback(domain) {
    try {
        // Fallback: DNS check to see if domain resolves
        const dnsCheck = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const dnsData = await dnsCheck.json();

        return {
            domain,
            status: dnsData.Answer ? 'active' : 'available',
            expirationDate: null,
            registrationDate: null,
            lastUpdate: null,
            registrar: 'Unknown (DNS Fallback)',
            daysRemaining: null,
            nameservers: [],
            statusCodes: [],
            lastChecked: new Date().toISOString(),
            source: 'DNS Fallback',
            error: 'RDAP data unavailable'
        };
    } catch (error) {
        return {
            domain,
            status: 'error',
            error: error.message,
            lastChecked: new Date().toISOString(),
            source: 'Error'
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

        // Fetch fresh data using RDAP
        results = await Promise.all(DOMAINS.map(checkDomainWithRDAP));

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
