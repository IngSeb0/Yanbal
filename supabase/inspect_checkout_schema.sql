-- Read-only inventory for the checkout schema. It does not change data or DDL.
select jsonb_build_object(
  'tables', coalesce((
    select jsonb_agg(jsonb_build_object(
      'schema', n.nspname,
      'name', c.relname,
      'rls_enabled', c.relrowsecurity,
      'rls_forced', c.relforcerowsecurity
    ) order by n.nspname, c.relname)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r','p') and n.nspname = 'public'
  ), '[]'::jsonb),
  'columns', coalesce((
    select jsonb_agg(jsonb_build_object(
      'table', cols.table_name,
      'position', cols.ordinal_position,
      'name', cols.column_name,
      'type', cols.data_type,
      'udt', cols.udt_name,
      'nullable', cols.is_nullable,
      'default', cols.column_default
    ) order by cols.table_name, cols.ordinal_position)
    from information_schema.columns cols
    where cols.table_schema = 'public'
  ), '[]'::jsonb),
  'constraints', coalesce((
    select jsonb_agg(jsonb_build_object(
      'table', c.relname,
      'name', con.conname,
      'type', con.contype,
      'validated', con.convalidated,
      'definition', pg_get_constraintdef(con.oid, true)
    ) order by c.relname, con.conname)
    from pg_constraint con
    join pg_class c on c.oid = con.conrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
  ), '[]'::jsonb),
  'indexes', coalesce((
    select jsonb_agg(jsonb_build_object(
      'table', tablename,
      'name', indexname,
      'definition', indexdef
    ) order by tablename, indexname)
    from pg_indexes
    where schemaname = 'public'
  ), '[]'::jsonb),
  'policies', coalesce((
    select jsonb_agg(to_jsonb(p) order by p.tablename, p.policyname)
    from pg_policies p
    where p.schemaname = 'public'
  ), '[]'::jsonb),
  'functions', coalesce((
    select jsonb_agg(jsonb_build_object(
      'name', p.proname,
      'identity_arguments', pg_get_function_identity_arguments(p.oid),
      'security_definer', p.prosecdef,
      'definition', pg_get_functiondef(p.oid)
    ) order by p.proname, pg_get_function_identity_arguments(p.oid))
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  ), '[]'::jsonb),
  'triggers', coalesce((
    select jsonb_agg(jsonb_build_object(
      'table', event_object_table,
      'name', trigger_name,
      'timing', action_timing,
      'event', event_manipulation,
      'statement', action_statement
    ) order by event_object_table, trigger_name, event_manipulation)
    from information_schema.triggers
    where trigger_schema = 'public'
  ), '[]'::jsonb)
) as checkout_schema_inventory;
