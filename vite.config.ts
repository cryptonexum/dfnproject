import { resolve } from 'path'
// import { VitePWA } from 'vite-plugin-pwa';
// import { defineConfig } from 'vite';
// export default defineConfig = ({
//     // build: {
//     //     base: '/static/',
//     //     manifest: true,
//     //     target: 'esnext',
//     //     rollupOptions: {
//     //         input: {
//     //             main: resolve(__dirname, './index.html'),
//     //             home: resolve(__dirname, './home.html'),
//     //             manifest: resolve(__dirname, './manifest.json'),
//     //         },
//     //         outDir: 'public/static/',
//     //         assetsInlineLimit: 0,
//     //       },
         
//     // },
//     plugins: [VitePWA({ registerType: 'autoUpdate' })],
//   });

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
        appType: 'mpa',
        base: './',
        build: {
        manifest: true,
        target: 'esnext',
        rollupOptions: {
            input: {
                index: resolve(__dirname, './index.html'),
                home: resolve(__dirname, './home.html'),
                assets: resolve(__dirname, './assets.html'),
                history: resolve(__dirname, './history.html'),
                joinPlan: resolve(__dirname, './joinPlan.html'),
                onboarding: resolve(__dirname, './onboarding.html'),
                plans: resolve(__dirname, './plans.html'),
                promotions: resolve(__dirname, './promotions.html'),
                referrals: resolve(__dirname, './referrals.html'),
                stake: resolve(__dirname, './stake.html'),
                swap: resolve(__dirname, './swap.html'),
                team: resolve(__dirname, './team.html'),
                unstake: resolve(__dirname, './unstake.html'),
                WithdrawRewards: resolve(__dirname, './WithdrawRewards.html'),
                withdrawToken: resolve(__dirname, './withdrawToken.html'),

            }
          },
         
    },
  plugins: [VitePWA({ registerType: 'autoUpdate' })],
});