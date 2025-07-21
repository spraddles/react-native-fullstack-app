CREATE OR REPLACE FUNCTION enqueue_job(
  target_queue text,
  payload      jsonb
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pgmq, public
AS $$
BEGIN
  RETURN pgmq.send(
           queue_name := target_queue,
           msg        := payload
         )::bigint;
END;
$$;

GRANT EXECUTE ON FUNCTION enqueue_job(text, jsonb)
       TO authenticated, service_role;