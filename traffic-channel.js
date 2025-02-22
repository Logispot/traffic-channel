function categorizeTrafficChannel() {
    const urlParams = new URLSearchParams(getAllQueryParams());
    const referrer = document.referrer || '(direct)';

    // Check for UTM parameters
    const utmSource = urlParams.get('utm_source') || '(direct)';
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign') || '(not set)';

    // Priority: UTM parameters
    if (utmMedium) {
        const medium = utmMedium.toLowerCase();
        if (['cpc', 'ppc', 'display', 'brand_search'].includes(medium)) {
            return {
                channel: 'Paid Search',
                source: utmSource,
                medium: medium,
                campaign: utmCampaign,
            };
        }
        if (['email', 'newsletter'].includes(medium)) {
            return {
                channel: 'Email',
                source: utmSource,
                medium: medium,
                campaign: utmCampaign,
            };
        }
        if (['social', 'social-media'].includes(medium)) {
            return {
                channel: 'Organic Social',
                source: utmSource,
                medium: medium,
                campaign: utmCampaign,
            };
        }
        return {
            channel: 'Other',
            source: utmSource,
            medium: medium,
            campaign: utmCampaign,
        };
    }

    // Secondary: Referrer-based logic
    if (referrer !== '(direct)') {
        let referrerHost;
        try {
            referrerHost = new URL(referrer).hostname;
        } catch {
            referrerHost = '(invalid-referrer)';
        }

        // Paid Search (known search engines)
        const paidSearchParams = [
            'gclid', // Google Ads
            'adgroupid', // Google Ads
            'msclkid', // Microsoft Ads
            'fbclid', // Facebook
            'ttclid', // Tiktok
            'n_campaign_type', // 네이버
            'n_media', // 네이버
            'n_ad_group', // 네이버
            'DMC_channel', // 다음
            'DMC_campaign', // 다음
            'DMC_keyword', // 다음
            'DMC_medium', // 다음
            'DMC_source', // 다음
        ];
        if (paidSearchParams.some(param => urlParams.has(param))) {
            return {
                channel: 'Paid Search',
                source: referrerHost,
                medium: 'cpc',
                campaign: '(not set)',
            };
        }

        // Organic Search (known search engines)
        const searchEngines = [
            'lens.google.com',
            'google.com',
            'google',
            'bing.com',
            'bing',
            'edgeservices.bing.com',
            'ecosia.org',
            'yahoo.com',
            'duckduckgo.com',
            'baidu.com',
            'baidu',
            'naver.com',
            'naver',
            'm.naver.com',
            'm.search.naver.com',
            'ad.search.naver.com',
            'daum.net',
            'daum',
            'm.search.daum.net',
            'nate'
        ];

        if (searchEngines.some(engine => referrerHost.toLowerCase().includes(engine))) {
            return {
                channel: 'Organic Search',
                source: referrerHost,
                medium: 'organic',
                campaign: '(not set)',
            };
        }

        // Organic Social (known social media platforms)
        const socialPlatforms = [
            'facebook.com',
            'l.facebook.com',
            'twitter.com',
            'linkedin',
            'linkedin.com',
            'kr.linkedin.com',
            'instagram.com',
            'l.instagram.com',
            'pinterest.com',
            'reddit.com',
            'tiktok.com',
            'kakao',
            'kakao.vc',
            'map.kakao.com',
            'place.map.kakao.com',
            'blog.naver.com',
            'm.blog.naver.com',
            'naverblog'
        ];

        if (socialPlatforms.some(platform => referrerHost.includes(platform))) {
            return {
                channel: 'Organic Social',
                source: referrerHost,
                medium: 'social',
                campaign: '(not set)',
            };
        }

        // Organic Video
        const socialVideos = [
            'youtube.com'
        ];

        if (socialVideos.some(platform => referrerHost.includes(platform))) {
            return {
                channel: 'Organic Video',
                source: referrerHost,
                medium: 'video',
                campaign: '(not set)',
            };
        }

        // Referral
        return {
            channel: 'Referral',
            source: referrerHost,
            medium: 'referral',
            campaign: '(not set)',
        };
    }

    // Fallback: Direct
    return {
        channel: 'Direct',
        source: '(direct)',
        medium: '(none)',
        campaign: '(not set)',
    };
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function saveTrafficDetailsToCookie(options = {}) {
    const defaultOptions = {
        cookieExpirationDays: 30, // Save for 30 days
    };

    const lChannel = getCookie('l_traffic_channel');
    const lSource = getCookie('l_traffic_source');
    const lMedium = getCookie('l_traffic_medium');
    const lCampaign = getCookie('l_traffic_campaign');

    if (!lChannel && !lSource && !lMedium && !lCampaign) {
        const { channel, source, medium, campaign } = categorizeTrafficChannel();
        setCookie('l_traffic_channel', channel, defaultOptions.cookieExpirationDays);
        setCookie('l_traffic_source', source, defaultOptions.cookieExpirationDays);
        setCookie('l_traffic_medium', medium, defaultOptions.cookieExpirationDays);
        setCookie('l_traffic_campaign', campaign, defaultOptions.cookieExpirationDays);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

function getAllQueryParams() {
    const queryObject = {};

    if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.forEach((value, key) => {
            queryObject[key] = value;
        });
    }

    if (window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        hashParams.forEach((value, key) => {
            queryObject[key] = value;
        });
    }

    return queryObject;
}