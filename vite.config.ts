 import { resolve } from 'path'
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  appType: 'mpa',
      build: {
          manifest: true,
          target: 'esnext',
          rollupOptions: {
              input: {
                  main: resolve(__dirname, './index.html'),
                  home: resolve(__dirname, './home.html'),
                  assets: resolve(__dirname, './assets.html'),
                  joinPlan: resolve(__dirname, './joinPlan.html'),
                  plans: resolve(__dirname, './stakePlan.html'),
                  promotions: resolve(__dirname, './promotions.html'),
                  referrals: resolve(__dirname, './referrals.html'),
                  stake: resolve(__dirname, './stake.html'),
                  swap: resolve(__dirname, './swap.html'),
                  team: resolve(__dirname, './team.html'),
                  unstake: resolve(__dirname, './unstake.html'),
                  withdrawRewards: resolve(__dirname, './withdrawRewards.html'),
                  withdrawToken: resolve(__dirname, './withdrawToken.html'),
                  notFound: resolve(__dirname, './error.html'),
                  

              }
            },
           
      },
      plugins: [VitePWA({ registerType: 'autoUpdate' })]
    });