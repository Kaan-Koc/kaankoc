import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'edge';

const DOMAINS = ['kaankoc.com', 'kaankoc.net'];

async function checkDomainStatus(domain) {
    try {
        const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_free&domainName=${domain}&outputFormat=JSON`);

        if (!response.ok) {
            const dnsCheck = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
            const dnsData = await dnsCheck.json();

            return {
                domain,
                status: dnsData.Answer ? 'active' : 'available',
                daysRemaining: null
            };
        }

        const data = await response.json();
        const whoisRecord = data.WhoisRecord;

        if (!whoisRecord || whoisRecord.dataError) {
            return { domain, status: 'error', daysRemaining: null };
        }

        const expirationDate = whoisRecord.expiresDate || whoisRecord.registryData?.expiresDate;

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
            daysRemaining
        };
    } catch (error) {
        return { domain, status: 'error', daysRemaining: null };
    }
}

async function sendAlert(resend, email, domain, daysRemaining, type) {
    let subject, message;

    if (type === 'available') {
        subject = `🚨 ACİL: ${domain} Domain Boşa Düştü!`;
        message = `
            <h2 style="color: #dc2626;">⚠️ Domain Boşa Düştü!</h2>
            <p><strong>Domain:</strong> ${domain}</p>
            <p><strong>Durum:</strong> Artık kullanılabilir</p>
            <p>Domain'iniz sona ermiş ve başkaları tarafından alınabilir durumda. Hemen yenileyin!</p>
        `;
    } else if (daysRemaining <= 7) {
        subject = `🚨 ACİL: ${domain} - ${daysRemaining} Gün Kaldı!`;
        message = `
            <h2 style="color: #dc2626;">⚠️ Domain Süresi Bitiyor!</h2>
            <p><strong>Domain:</strong> ${domain}</p>
            <p><strong>Kalan Süre:</strong> ${daysRemaining} gün</p>
            <p style="color: #dc2626; font-weight: bold;">ACİL: Domain'inizi hemen yenileyin!</p>
        `;
    } else if (daysRemaining <= 30) {
        subject = `⚠️ Uyarı: ${domain} - ${daysRemaining} Gün Kaldı`;
        message = `
            <h2 style="color: #f59e0b;">⏰ Domain Yenilemesi Yaklaşıyor</h2>
            <p><strong>Domain:</strong> ${domain}</p>
            <p><strong>Kalan Süre:</strong> ${daysRemaining} gün</p>
            <p>Domain'inizi yakında yenilemeyi unutmayın.</p>
        `;
    }

    if (subject && message) {
        await resend.emails.send({
            from: 'Domain Monitor <noreply@kaankoc.net>',
            to: email,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    ${message}
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">
                        Otomatik Domain İzleme Sistemi - kaankoc.net
                    </p>
                </div>
            `
        });
    }
}

export async function GET(request) {
    try {
        const ctx = getRequestContext();
        const env = ctx?.env || {};
        const portfolioKV = env.PORTFOLIO_DATA;
        const resendApiKey = env.RESEND_API_KEY;
        const alertEmail = env.DOMAIN_ALERT_EMAIL || 'kaankociletisim@gmail.com';

        if (!resendApiKey) {
            return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
        }

        const resend = new Resend(resendApiKey);
        const results = await Promise.all(DOMAINS.map(checkDomainStatus));

        // Check each domain and send alerts
        for (const result of results) {
            if (result.status === 'available') {
                // Domain became available
                const alertKey = `domain_alert_available_${result.domain}`;
                const alreadySent = portfolioKV ? await portfolioKV.get(alertKey) : null;

                if (!alreadySent) {
                    await sendAlert(resend, alertEmail, result.domain, null, 'available');
                    if (portfolioKV) {
                        await portfolioKV.put(alertKey, 'true', { expirationTtl: 2592000 }); // 30 days
                    }
                }
            } else if (result.status === 'active' && result.daysRemaining !== null) {
                // Check for 30-day and 7-day warnings
                if (result.daysRemaining <= 7) {
                    const alertKey = `domain_alert_7d_${result.domain}`;
                    const alreadySent = portfolioKV ? await portfolioKV.get(alertKey) : null;

                    if (!alreadySent) {
                        await sendAlert(resend, alertEmail, result.domain, result.daysRemaining, '7day');
                        if (portfolioKV) {
                            await portfolioKV.put(alertKey, 'true', { expirationTtl: 604800 }); // 7 days
                        }
                    }
                } else if (result.daysRemaining <= 30) {
                    const alertKey = `domain_alert_30d_${result.domain}`;
                    const alreadySent = portfolioKV ? await portfolioKV.get(alertKey) : null;

                    if (!alreadySent) {
                        await sendAlert(resend, alertEmail, result.domain, result.daysRemaining, '30day');
                        if (portfolioKV) {
                            await portfolioKV.put(alertKey, 'true', { expirationTtl: 2592000 }); // 30 days
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, checked: results.length });
    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: 'Failed to run domain check' }, { status: 500 });
    }
}
