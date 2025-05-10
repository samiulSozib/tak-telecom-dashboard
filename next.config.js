/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
    i18n: {
        locales: ['fa','en' , 'bn' , 'ar' , 'tr' , 'ps' , 'ge' , 'hi' ],
        defaultLocale: 'en', // Set the default locale
        localeDetection: false,
    },
    reactStrictMode: false,
    localePath: path.resolve('./public/locales'),
    experimental: {
        //metadataBase: 'http://localhost:3000', // Replace with your actual domain
        metadataBase:'https://telecom-admin.vercel.app'
    },
}

module.exports = nextConfig
