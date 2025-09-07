import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authLogger } from '@/utils/logger';

export const useAuthLogger = () => {
  useEffect(() => {
    authLogger.info('Setting up auth state listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      authLogger.info('Auth state changed', {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString()
      });

      switch (event) {
        case 'SIGNED_IN':
          authLogger.action('user-signed-in', {
            userId: session?.user?.id,
            email: session?.user?.email,
            provider: session?.user?.app_metadata?.provider
          });
          break;

        case 'SIGNED_OUT':
          authLogger.action('user-signed-out');
          break;

        case 'TOKEN_REFRESHED':
          authLogger.debug('auth-token-refreshed', {
            userId: session?.user?.id,
            expiresAt: session?.expires_at
          });
          break;

        case 'USER_UPDATED':
          authLogger.info('user-profile-updated', {
            userId: session?.user?.id,
            email: session?.user?.email
          });
          break;

        case 'PASSWORD_RECOVERY':
          authLogger.action('password-recovery-initiated', {
            userId: session?.user?.id
          });
          break;

        default:
          authLogger.debug('unhandled-auth-event', { event });
      }
    });

    return () => {
      authLogger.info('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  return { authLogger };
};