CREATE OR REPLACE FUNCTION enqueue_payment_job(payload jsonb)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = pgmq, public
AS $$
  SELECT pgmq.send(
           queue_name := 'payment_jobs',
           msg        := payload
         )::bigint;
$$;

GRANT EXECUTE ON FUNCTION enqueue_payment_job(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION enqueue_payment_job(jsonb) TO service_role;