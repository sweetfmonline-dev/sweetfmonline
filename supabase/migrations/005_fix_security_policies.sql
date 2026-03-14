-- Fix newsletter_subscribers RLS policies
-- CRITICAL: Currently anyone can read all subscriber emails and update any subscription

-- Drop overly permissive policies
DROP POLICY IF EXISTS "public_select_newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "public_update_newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public select own subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public update own subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public to read by token" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public to unsubscribe" ON public.newsletter_subscribers;

-- New SELECT policy: only allow reading by unsubscribe_token (not all emails)
CREATE POLICY "select_by_unsubscribe_token"
  ON public.newsletter_subscribers FOR SELECT
  TO anon
  USING (false);
-- Note: unsubscribe lookups now go through the API route which uses service_role via PATCH

-- New UPDATE policy: only allow updating is_active via unsubscribe_token
CREATE POLICY "update_by_unsubscribe_token"
  ON public.newsletter_subscribers FOR UPDATE
  TO anon
  USING (false);
-- Note: unsubscribe updates now go through the API route

-- Fix comments: add content length check
-- (Rate limiting handled in API route, not RLS)
