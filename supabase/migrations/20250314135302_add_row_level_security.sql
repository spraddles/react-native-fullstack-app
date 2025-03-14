-- USER_META
alter table public.user_meta
enable row level security;
-- select
CREATE POLICY "Users can select their own user_meta records" 
ON public.user_meta 
FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = user_id);
-- insert
CREATE POLICY "Users can insert their own user_meta records" 
ON public.user_meta 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = user_id);
-- update
CREATE POLICY "Users can update their own user_meta records"
ON public.user_meta 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = user_id) 
WITH CHECK ((select auth.uid()) = user_id);
-- delete
CREATE POLICY "Users can delete their own user_meta records" 
ON public.user_meta 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = user_id);


-- TRANSACTIONS
alter table public.transactions
enable row level security;
-- select
CREATE POLICY "Users can select their own transactions" 
ON public.transactions 
FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = sender_id);
-- insert
CREATE POLICY "Users can insert their own transactions" 
ON public.transactions 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = sender_id);
-- update
CREATE POLICY "Users can update their own transactions"
ON public.transactions 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = sender_id) 
WITH CHECK ((select auth.uid()) = sender_id);
-- delete
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = sender_id);


-- CARDS
alter table public.cards
enable row level security;
-- select
CREATE POLICY "Users can select their own cards" 
ON public.cards 
FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = user_id);
-- insert
CREATE POLICY "Users can insert their own cards" 
ON public.cards 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = user_id);
-- update
CREATE POLICY "Users can update their own cards"
ON public.cards 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = user_id) 
WITH CHECK ((select auth.uid()) = user_id);
-- delete
CREATE POLICY "Users can delete their own cards" 
ON public.cards 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = user_id);