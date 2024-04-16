--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Setup extensions
--

CREATE EXTENSION "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION "pg_trgm" WITH SCHEMA public;
CREATE EXTENSION "btree_gin" WITH SCHEMA public;
CREATE EXTENSION "pgcrypto" WITH SCHEMA public;

--
-- Name: analytics; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA analytics;


--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- Name: SCHEMA audit; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA audit IS 'Out-of-table audit/history logging tables and trigger functions';


--
-- Name: core; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA core;


--
-- Name: debug; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA debug;


--
-- Name: diagnostics_event; Type: TYPE; Schema: analytics; Owner: -
--

CREATE TYPE analytics.diagnostics_event AS ENUM (
    'directCall',
    'unnecessaryReset',
    'duplicateIdentify',
    'validationFailure',
    'rapidInitializations',
    'excessiveInitializations',
    'multipleSidebars',
    'deprecatedIdentifyCall'
);


--
-- Name: allowed_embed_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.allowed_embed_type AS ENUM (
    'inline',
    'sidebar'
);


--
-- Name: attribute_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.attribute_type AS ENUM (
    'account',
    'account_user'
);


--
-- Name: attribute_value_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.attribute_value_type AS ENUM (
    'number',
    'text',
    'boolean',
    'date',
    'stringArray'
);


--
-- Name: auth_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.auth_type AS ENUM (
    'email',
    'google'
);


--
-- Name: auto_complete_interaction_completable_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.auto_complete_interaction_completable_type AS ENUM (
    'step_prototype'
);


--
-- Name: auto_complete_interaction_interaction_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.auto_complete_interaction_interaction_type AS ENUM (
    'guide_completion'
);


--
-- Name: branching_action_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.branching_action_type AS ENUM (
    'create'
);


--
-- Name: branching_entity_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.branching_entity_type AS ENUM (
    'template',
    'guide',
    'module'
);


--
-- Name: context_tag_alignment; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.context_tag_alignment AS ENUM (
    'top_right',
    'top_left',
    'center_right',
    'center_left',
    'bottom_right',
    'bottom_left'
);


--
-- Name: context_tag_tooltip_alignment; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.context_tag_tooltip_alignment AS ENUM (
    'right',
    'left',
    'top',
    'bottom'
);


--
-- Name: context_tag_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.context_tag_type AS ENUM (
    'dot',
    'icon',
    'badge',
    'badge_dot',
    'badge_icon',
    'highlight'
);


--
-- Name: custom_api_event_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.custom_api_event_type AS ENUM (
    'event',
    'event-property'
);


--
-- Name: custom_attribute_source; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.custom_attribute_source AS ENUM (
    'bento',
    'snippet',
    'import',
    'segment'
);


--
-- Name: custom_attribute_value_identifier_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.custom_attribute_value_identifier_type AS ENUM (
    'account',
    'account_user'
);


--
-- Name: data_usage_scope; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.data_usage_scope AS ENUM (
    'account',
    'account_user'
);


--
-- Name: data_usage_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.data_usage_type AS ENUM (
    'attribute',
    'event'
);


--
-- Name: embed_sidebar_side; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.embed_sidebar_side AS ENUM (
    'left',
    'right'
);


--
-- Name: embed_toggle_behavior; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.embed_toggle_behavior AS ENUM (
    'default',
    'resource_center'
);


--
-- Name: embed_toggle_style; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.embed_toggle_style AS ENUM (
    'arrow',
    'progress_ring',
    'text',
    'hidden'
);


--
-- Name: form_factor; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.form_factor AS ENUM (
    'inline_sidebar',
    'inline',
    'sidebar',
    'modal',
    'banner',
    'tooltip',
    'flow'
);


--
-- Name: guide_base_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.guide_base_state AS ENUM (
    'draft',
    'active',
    'inactive',
    'paused'
);


--
-- Name: guide_completion_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.guide_completion_state AS ENUM (
    'incomplete',
    'complete',
    'done'
);


--
-- Name: guide_expiration_criteria; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.guide_expiration_criteria AS ENUM (
    'never',
    'step_completion',
    'launch'
);


--
-- Name: guide_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.guide_state AS ENUM (
    'draft',
    'active',
    'inactive',
    'expired'
);


--
-- Name: guide_target_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.guide_target_type AS ENUM (
    'user',
    'role',
    'all',
    'attribute_rules'
);


--
-- Name: guide_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.guide_type AS ENUM (
    'account',
    'user',
    'pre',
    'template',
    'split_test'
);


--
-- Name: inline_embed_position; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.inline_embed_position AS ENUM (
    'inside',
    'before',
    'after'
);


--
-- Name: inline_embed_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.inline_embed_state AS ENUM (
    'active',
    'inactive'
);


--
-- Name: inline_empty_behavior; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.inline_empty_behavior AS ENUM (
    'show',
    'hide'
);


--
-- Name: inline_injection_alignment; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.inline_injection_alignment AS ENUM (
    'left',
    'right',
    'center'
);


--
-- Name: input_field_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.input_field_type AS ENUM (
    'text',
    'email',
    'nps',
    'paragraph',
    'numberPoll',
    'dropdown',
    'date'
);


--
-- Name: input_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.input_type AS ENUM (
    'file',
    'text',
    'select'
);


--
-- Name: integration_states; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.integration_states AS ENUM (
    'active',
    'inactive'
);


--
-- Name: internal_feature_flag_states; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.internal_feature_flag_states AS ENUM (
    'all',
    'none',
    'percentage',
    'stringMatch',
    'rateDict'
);


--
-- Name: media_reference_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.media_reference_type AS ENUM (
    'step_prototype'
);


--
-- Name: media_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.media_type AS ENUM (
    'image',
    'video',
    'number_attribute'
);


--
-- Name: minimal_sidebar_sizes; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.minimal_sidebar_sizes AS ENUM (
    'sm',
    'lg'
);


--
-- Name: module_append_states; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.module_append_states AS ENUM (
    'active',
    'inactive'
);


--
-- Name: notification_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.notification_type AS ENUM (
    'steps',
    'video-alert',
    'segment-error'
);


--
-- Name: nps_ending_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_ending_type AS ENUM (
    'date_based',
    'answer_based',
    'manual'
);


--
-- Name: nps_form_factor; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_form_factor AS ENUM (
    'banner'
);


--
-- Name: nps_fup_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_fup_type AS ENUM (
    'none',
    'universal',
    'score_based'
);


--
-- Name: nps_page_targeting_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_page_targeting_type AS ENUM (
    'any_page',
    'specific_page'
);


--
-- Name: nps_starting_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_starting_type AS ENUM (
    'manual',
    'date_based'
);


--
-- Name: nps_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_state AS ENUM (
    'draft',
    'live',
    'stopped',
    'deleted'
);


--
-- Name: nps_survey_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.nps_survey_state AS ENUM (
    'active',
    'finished',
    'terminated'
);


--
-- Name: organization_plan; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.organization_plan AS ENUM (
    'Starter',
    'Growth',
    'Scale',
    'Custom'
);


--
-- Name: organization_settings_tag_pulse_level; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.organization_settings_tag_pulse_level AS ENUM (
    'standard',
    'none'
);


--
-- Name: organization_states; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.organization_states AS ENUM (
    'active',
    'inactive',
    'trial'
);


--
-- Name: page_targeting_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.page_targeting_type AS ENUM (
    'any_page',
    'specific_page',
    'visual_tag',
    'inline'
);


--
-- Name: sidebar_availability; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.sidebar_availability AS ENUM (
    'default',
    'never_open',
    'hide'
);


--
-- Name: sidebar_style; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.sidebar_style AS ENUM (
    'slide_out',
    'side_by_side',
    'floating'
);


--
-- Name: sidebar_visibility; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.sidebar_visibility AS ENUM (
    'show',
    'active_guides',
    'active_onboarding_guides',
    'hide'
);


--
-- Name: step_auto_complete_interaction_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_auto_complete_interaction_type AS ENUM (
    'click'
);


--
-- Name: step_branching_form_factor; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_branching_form_factor AS ENUM (
    'dropdown',
    'cards'
);


--
-- Name: step_completed_by_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_completed_by_type AS ENUM (
    'auto',
    'user',
    'account_user'
);


--
-- Name: step_cta_style; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_cta_style AS ENUM (
    'solid',
    'outline',
    'link'
);


--
-- Name: step_cta_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_cta_type AS ENUM (
    'complete',
    'skip',
    'save',
    'url',
    'launch',
    'url_complete',
    'back',
    'next',
    'event'
);


--
-- Name: step_event_mapping_rule_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_event_mapping_rule_type AS ENUM (
    'greater_than',
    'greater_than_or_equal_to',
    'equals',
    'less_than',
    'less_than_or_equal_to'
);


--
-- Name: step_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.step_type AS ENUM (
    'required',
    'optional',
    'fyi',
    'branching',
    'branching_optional',
    'input'
);


--
-- Name: tag_visibility; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.tag_visibility AS ENUM (
    'always',
    'active_step'
);


--
-- Name: template_auto_launch_rule_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.template_auto_launch_rule_type AS ENUM (
    'all',
    'attribute_rules'
);


--
-- Name: template_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.template_state AS ENUM (
    'draft',
    'live',
    'stopped',
    'removed'
);


--
-- Name: template_target_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.template_target_type AS ENUM (
    'all',
    'role',
    'attribute_rules'
);


--
-- Name: themes; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.themes AS ENUM (
    'standard',
    'minimal',
    'mailchimp',
    'timeline',
    'card',
    'carousel',
    'videoGallery'
);


--
-- Name: user_status; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.user_status AS ENUM (
    'active',
    'unverified',
    'disabled',
    'invited'
);


--
-- Name: visual_builder_session_state; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.visual_builder_session_state AS ENUM (
    'pending_url',
    'in_progress',
    'cancelled',
    'complete'
);


--
-- Name: visual_builder_session_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.visual_builder_session_type AS ENUM (
    'tag',
    'inline',
    'autocomplete',
    'auto_guide_builder'
);


--
-- Name: webhook_states; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.webhook_states AS ENUM (
    'active',
    'inactive'
);


--
-- Name: webhook_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.webhook_type AS ENUM (
    'standard',
    'zapier'
);


--
-- Name: audit_table(regclass); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.audit_table(target_table regclass) RETURNS void
    LANGUAGE sql
    AS $_$
	SELECT audit.audit_table($1, BOOLEAN 't', BOOLEAN 't');
	$_$;


--
-- Name: FUNCTION audit_table(target_table regclass); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.audit_table(target_table regclass) IS '
	Add auditing support to the given table. Row-level changes will be logged with full client query text. No cols are ignored.
	';


--
-- Name: audit_table(regclass, boolean, boolean); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) RETURNS void
    LANGUAGE sql
    AS $_$
	SELECT audit.audit_table($1, $2, $3, ARRAY[]::text[]);
	$_$;


--
-- Name: audit_table(regclass, boolean, boolean, text[]); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
	DECLARE
		stm_targets text = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
		_q_txt text;
		_ignored_cols_snip text = '';
	BEGIN
			EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table;
			EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table;

			IF audit_rows THEN
					IF array_length(ignored_cols,1) > 0 THEN
							_ignored_cols_snip = ', ' || quote_literal(ignored_cols);
					END IF;
					_q_txt = 'CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' ||
									target_table ||
									' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
									quote_literal(audit_query_text) || _ignored_cols_snip || ');';
					RAISE NOTICE '%',_q_txt;
					EXECUTE _q_txt;
					stm_targets = 'TRUNCATE';
			ELSE
			END IF;

			_q_txt = 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
							target_table ||
							' FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('||
							quote_literal(audit_query_text) || ');';
			RAISE NOTICE '%',_q_txt;
			EXECUTE _q_txt;

	END;
	$$;


--
-- Name: FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) IS '
	Add auditing support to a table.

	Arguments:
		target_table:     Table name, schema qualified if not on search_path
		audit_rows:       Record each row change, or only audit at a statement level
		audit_query_text: Record the text of the client query that triggered the audit event?
		ignored_cols:     Columns to exclude from update diffs, ignore updates that change only ignored cols.
	';


--
-- Name: if_modified_func(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.if_modified_func() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public'
    AS $$
	DECLARE
			audit_row audit.logged_actions;
			include_values boolean;
			log_diffs boolean;
			h_old jsonb;
			h_new jsonb;
			excluded_cols text[] = ARRAY[]::text[];
	BEGIN
			IF TG_WHEN <> 'AFTER' THEN
					RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger';
			END IF;

			audit_row = ROW(
					nextval('audit.logged_actions_event_id_seq'), -- event_id
					TG_TABLE_SCHEMA::text,                        -- schema_name
					TG_TABLE_NAME::text,                          -- table_name
					TG_RELID,                                     -- relation OID for much quicker searches
					session_user::text,                           -- session_user_name
					current_timestamp,                            -- action_tstamp_tx
					statement_timestamp(),                        -- action_tstamp_stm
					clock_timestamp(),                            -- action_tstamp_clk
					txid_current(),                               -- transaction ID
					current_setting('application_name'),          -- client application
					inet_client_addr(),                           -- client_addr
					inet_client_port(),                           -- client_port
					current_query(),                              -- top-level query or queries (if multistatement) from client
					substring(TG_OP,1,1),                         -- action
					NULL, NULL,                                   -- row_data, changed_fields
					'f'                                           -- statement_only
					);

			IF NOT TG_ARGV[0]::boolean IS DISTINCT FROM 'f'::boolean THEN
					audit_row.client_query = NULL;
			END IF;

			IF TG_ARGV[1] IS NOT NULL THEN
					excluded_cols = TG_ARGV[1]::text[];
			END IF;

			IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
					audit_row.row_data = row_to_json(OLD)::JSONB - excluded_cols;

					--Computing differences
			SELECT
				jsonb_object_agg(tmp_new_row.key, tmp_new_row.value) AS new_data
				INTO audit_row.changed_fields
			FROM jsonb_each_text(row_to_json(NEW)::JSONB) AS tmp_new_row
					JOIN jsonb_each_text(audit_row.row_data) AS tmp_old_row ON (tmp_new_row.key = tmp_old_row.key AND tmp_new_row.value IS DISTINCT FROM tmp_old_row.value);

					IF audit_row.changed_fields = '{}'::JSONB THEN
							-- All changed fields are ignored. Skip this update.
							RETURN NULL;
					END IF;
			ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
					audit_row.row_data = row_to_json(OLD)::JSONB - excluded_cols;
			ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
					audit_row.row_data = row_to_json(NEW)::JSONB - excluded_cols;
			ELSIF (TG_LEVEL = 'STATEMENT' AND TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN
					audit_row.statement_only = 't';
			ELSE
					RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger for unhandled case: %, %',TG_OP, TG_LEVEL;
					RETURN NULL;
			END IF;
			INSERT INTO audit.logged_actions VALUES (audit_row.*);
			RETURN NULL;
	END;
	$$;


--
-- Name: FUNCTION if_modified_func(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.if_modified_func() IS '
	Track changes to a table at the statement and/or row level.

	Optional parameters to trigger in CREATE TRIGGER call:

	param 0: boolean, whether to log the query text. Default ''t''.

	param 1: text[], columns to ignore in updates. Default [].

					Updates to ignored cols are omitted from changed_fields.

					Updates with only ignored cols changed are not inserted
					into the audit log.

					Almost all the processing work is still done for updates
					that ignored. If you need to save the load, you need to use
					WHEN clause on the trigger instead.

					No warning or error is issued if ignored_cols contains columns
					that do not exist in the target table. This lets you specify
					a standard set of ignored columns.

	There is no parameter to disable logging of values. Add this trigger as
	a ''FOR EACH STATEMENT'' rather than ''FOR EACH ROW'' trigger if you do not
	want to log row values.

	Note that the user name logged is the login role for the session. The audit trigger
	cannot obtain the active role because it is reset by the SECURITY DEFINER invocation
	of the audit trigger its self.
	';


--
-- Name: log_deleted_user(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.log_deleted_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
        BEGIN

        INSERT INTO audit.deleted_users (user_id, data)
        VALUES (OLD.id, row_to_json(OLD));

        RETURN NULL;

        END;
      $$;


--
-- Name: create_organization_settings_func(); Type: FUNCTION; Schema: core; Owner: -
--

CREATE FUNCTION core.create_organization_settings_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
  INSERT INTO core.organization_settings(organization_id) values(NEW.id);
  RETURN NEW;
  END;
  $$;


--
-- Name: update_modified_column(); Type: FUNCTION; Schema: core; Owner: -
--

CREATE FUNCTION core.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
      NEW.updated_at = now() at time zone 'utc';
      RETURN NEW;
  END;
  $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_user_daily_log; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.account_user_daily_log (
    id integer NOT NULL,
    organization_id integer NOT NULL,
    account_user_id integer NOT NULL,
    date date NOT NULL
);


--
-- Name: account_user_daily_log_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.account_user_daily_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_user_daily_log_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.account_user_daily_log_id_seq OWNED BY analytics.account_user_daily_log.id;


--
-- Name: account_user_data; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.account_user_data (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_user_id integer,
    steps_viewed integer DEFAULT 0,
    steps_completed integer DEFAULT 0,
    current_step_id integer,
    step_last_seen timestamp with time zone,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_active_in_app timestamp with time zone
);


--
-- Name: account_user_data_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.account_user_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_user_data_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.account_user_data_id_seq OWNED BY analytics.account_user_data.id;


--
-- Name: account_user_events; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.account_user_events (
    id integer NOT NULL,
    event_name text NOT NULL,
    organization_entity_id uuid NOT NULL,
    account_user_entity_id uuid NOT NULL,
    location text,
    data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: account_user_events_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.account_user_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_user_events_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.account_user_events_id_seq OWNED BY analytics.account_user_events.id;


--
-- Name: announcement_daily_activity; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.announcement_daily_activity (
    organization_id integer NOT NULL,
    template_id integer NOT NULL,
    date date NOT NULL,
    cta_activity jsonb DEFAULT '{}'::jsonb,
    saved_for_later integer DEFAULT 0 NOT NULL,
    dismissed integer DEFAULT 0 NOT NULL,
    viewed integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


--
-- Name: announcement_daily_activity_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.announcement_daily_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcement_daily_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.announcement_daily_activity_id_seq OWNED BY analytics.announcement_daily_activity.id;


--
-- Name: captured_guide_analytics; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.captured_guide_analytics (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer NOT NULL,
    stats jsonb DEFAULT '{}'::jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: captured_guide_analytics_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.captured_guide_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: captured_guide_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.captured_guide_analytics_id_seq OWNED BY analytics.captured_guide_analytics.id;


--
-- Name: data_usage; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.data_usage (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    type core.data_usage_type NOT NULL,
    scope core.data_usage_scope NOT NULL,
    autocompletes jsonb,
    autolaunches jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: data_usage_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.data_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.data_usage_id_seq OWNED BY analytics.data_usage.id;


--
-- Name: diagnostics_events; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.diagnostics_events (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    event analytics.diagnostics_event NOT NULL,
    payload jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: diagnostics_events_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.diagnostics_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: diagnostics_events_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.diagnostics_events_id_seq OWNED BY analytics.diagnostics_events.id;


--
-- Name: events; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.events (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    event_name text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    account_user_entity_id uuid,
    organization_entity_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    step_entity_id uuid,
    guide_entity_id uuid,
    source text
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.events_id_seq OWNED BY analytics.events.id;


--
-- Name: feature_events; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.feature_events (
    id integer NOT NULL,
    event_name text NOT NULL,
    organization_entity_id uuid NOT NULL,
    account_user_entity_id uuid,
    user_entity_id uuid,
    data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: feature_events_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.feature_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_events_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.feature_events_id_seq OWNED BY analytics.feature_events.id;


--
-- Name: guide_daily_rollup; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.guide_daily_rollup (
    organization_id integer NOT NULL,
    account_user_id integer NOT NULL,
    guide_id integer NOT NULL,
    template_id integer NOT NULL,
    date date NOT NULL,
    id integer NOT NULL
);


--
-- Name: guide_daily_rollup_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.guide_daily_rollup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_daily_rollup_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.guide_daily_rollup_id_seq OWNED BY analytics.guide_daily_rollup.id;


--
-- Name: guide_data; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.guide_data (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    guide_base_id integer,
    ctas_clicked integer DEFAULT 0,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    users_completed_a_step integer DEFAULT 0 NOT NULL,
    participants_who_viewed integer DEFAULT 0 NOT NULL,
    users_viewed_a_step integer DEFAULT 0 NOT NULL,
    users_skipped_a_step integer DEFAULT 0 NOT NULL,
    completed_steps integer DEFAULT 0 NOT NULL,
    saved_for_later integer DEFAULT 0 NOT NULL,
    avg_steps_viewed integer,
    avg_steps_completed integer,
    avg_progress integer,
    guides_viewed integer,
    users_clicked_cta integer,
    users_answered integer,
    guides_completed integer
);


--
-- Name: guide_data_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.guide_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_data_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.guide_data_id_seq OWNED BY analytics.guide_data.id;


--
-- Name: guide_events; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.guide_events (
    id integer NOT NULL,
    event_name text NOT NULL,
    organization_entity_id uuid NOT NULL,
    guide_entity_id uuid NOT NULL,
    account_user_entity_id uuid,
    user_entity_id uuid,
    data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: guide_events_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.guide_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_events_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.guide_events_id_seq OWNED BY analytics.guide_events.id;


--
-- Name: organization_data; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.organization_data (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    diagnostics jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: organization_data_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.organization_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_data_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.organization_data_id_seq OWNED BY analytics.organization_data.id;


--
-- Name: rollup_states; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.rollup_states (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    rollup_name text NOT NULL,
    last_run timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    enabled boolean DEFAULT true NOT NULL
);


--
-- Name: rollup_states_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.rollup_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rollup_states_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.rollup_states_id_seq OWNED BY analytics.rollup_states.id;


--
-- Name: step_daily_rollup; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.step_daily_rollup (
    organization_id integer NOT NULL,
    account_user_id integer NOT NULL,
    step_id integer NOT NULL,
    step_prototype_id integer NOT NULL,
    date date NOT NULL,
    id integer NOT NULL
);


--
-- Name: step_daily_rollup_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.step_daily_rollup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_daily_rollup_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.step_daily_rollup_id_seq OWNED BY analytics.step_daily_rollup.id;


--
-- Name: step_data; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.step_data (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    step_prototype_id integer,
    associated_steps integer DEFAULT 0,
    completed_steps integer DEFAULT 0,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    template_id integer NOT NULL,
    viewed_steps integer,
    steps_in_viewed_guides integer
);


--
-- Name: step_data_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.step_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_data_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.step_data_id_seq OWNED BY analytics.step_data.id;


--
-- Name: step_events; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.step_events (
    id integer NOT NULL,
    event_name text NOT NULL,
    organization_entity_id uuid NOT NULL,
    account_user_entity_id uuid,
    user_entity_id uuid,
    step_entity_id uuid NOT NULL,
    location text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    data jsonb
);


--
-- Name: step_events_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.step_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_events_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.step_events_id_seq OWNED BY analytics.step_events.id;


--
-- Name: template_data; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.template_data (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer NOT NULL,
    stats jsonb DEFAULT '{}'::jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: template_data_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.template_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_data_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.template_data_id_seq OWNED BY analytics.template_data.id;


--
-- Name: value_data; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.value_data (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    data jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: value_data_aggregate; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.value_data_aggregate (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: value_data_aggregate_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.value_data_aggregate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: value_data_aggregate_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.value_data_aggregate_id_seq OWNED BY analytics.value_data_aggregate.id;


--
-- Name: value_data_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.value_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: value_data_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.value_data_id_seq OWNED BY analytics.value_data.id;


--
-- Name: account_audit; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.account_audit (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    context_id text NOT NULL,
    event_name text NOT NULL,
    account_id integer NOT NULL,
    user_id integer,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_system boolean
);


--
-- Name: account_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.account_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.account_audit_id_seq OWNED BY audit.account_audit.id;


--
-- Name: auth_audit; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.auth_audit (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    event_name text NOT NULL,
    outcome text NOT NULL,
    user_id integer,
    organization_id integer,
    request_id text,
    request_ip inet,
    meta jsonb,
    payload jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: auth_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.auth_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.auth_audit_id_seq OWNED BY audit.auth_audit.id;


--
-- Name: deleted_users; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.deleted_users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: deleted_users_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.deleted_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deleted_users_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.deleted_users_id_seq OWNED BY audit.deleted_users.id;


--
-- Name: guide_base_audit; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.guide_base_audit (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    context_id text NOT NULL,
    event_name text NOT NULL,
    guide_base_id integer NOT NULL,
    user_id integer,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: guide_base_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.guide_base_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_base_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.guide_base_audit_id_seq OWNED BY audit.guide_base_audit.id;


--
-- Name: logged_actions; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.logged_actions (
    event_id bigint NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    relid oid NOT NULL,
    session_user_name text,
    action_tstamp_tx timestamp with time zone NOT NULL,
    action_tstamp_stm timestamp with time zone NOT NULL,
    action_tstamp_clk timestamp with time zone NOT NULL,
    transaction_id bigint,
    application_name text,
    client_addr inet,
    client_port integer,
    client_query text,
    action text NOT NULL,
    row_data jsonb,
    changed_fields jsonb,
    statement_only boolean NOT NULL,
    CONSTRAINT logged_actions_action_check CHECK ((action = ANY (ARRAY['I'::text, 'D'::text, 'U'::text, 'T'::text])))
);


--
-- Name: TABLE logged_actions; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON TABLE audit.logged_actions IS 'History of auditable actions on audited tables, from audit.if_modified_func()';


--
-- Name: COLUMN logged_actions.event_id; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.event_id IS 'Unique identifier for each auditable event';


--
-- Name: COLUMN logged_actions.schema_name; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.schema_name IS 'Database schema audited table for this event is in';


--
-- Name: COLUMN logged_actions.table_name; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.table_name IS 'Non-schema-qualified table name of table event occured in';


--
-- Name: COLUMN logged_actions.relid; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.relid IS 'Table OID. Changes with drop/create. Get with ''tablename''::regclass';


--
-- Name: COLUMN logged_actions.session_user_name; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.session_user_name IS 'Login / session user whose statement caused the audited event';


--
-- Name: COLUMN logged_actions.action_tstamp_tx; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.action_tstamp_tx IS 'Transaction start timestamp for tx in which audited event occurred';


--
-- Name: COLUMN logged_actions.action_tstamp_stm; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.action_tstamp_stm IS 'Statement start timestamp for tx in which audited event occurred';


--
-- Name: COLUMN logged_actions.action_tstamp_clk; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.action_tstamp_clk IS 'Wall clock time at which audited event''s trigger call occurred';


--
-- Name: COLUMN logged_actions.transaction_id; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.transaction_id IS 'Identifier of transaction that made the change. May wrap, but unique paired with action_tstamp_tx.';


--
-- Name: COLUMN logged_actions.application_name; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.application_name IS 'Application name set when this audit event occurred. Can be changed in-session by client.';


--
-- Name: COLUMN logged_actions.client_addr; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.client_addr IS 'IP address of client that issued query. Null for unix domain socket.';


--
-- Name: COLUMN logged_actions.client_port; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.client_port IS 'Remote peer IP port address of client that issued query. Undefined for unix socket.';


--
-- Name: COLUMN logged_actions.client_query; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.client_query IS 'Top-level query that caused this auditable event. May be more than one statement.';


--
-- Name: COLUMN logged_actions.action; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.action IS 'Action type; I = insert, D = delete, U = update, T = truncate';


--
-- Name: COLUMN logged_actions.row_data; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.row_data IS 'Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.';


--
-- Name: COLUMN logged_actions.changed_fields; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.changed_fields IS 'New values of fields changed by UPDATE. Null except for row-level UPDATE events.';


--
-- Name: COLUMN logged_actions.statement_only; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.logged_actions.statement_only IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';


--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.logged_actions_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.logged_actions_event_id_seq OWNED BY audit.logged_actions.event_id;


--
-- Name: module_audit; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.module_audit (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    context_id text NOT NULL,
    event_name text NOT NULL,
    module_id integer NOT NULL,
    user_id integer,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_system boolean
);


--
-- Name: module_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.module_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: module_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.module_audit_id_seq OWNED BY audit.module_audit.id;


--
-- Name: step_prototype_audit; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.step_prototype_audit (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    context_id text NOT NULL,
    event_name text NOT NULL,
    step_prototype_id integer NOT NULL,
    user_id integer,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_system boolean
);


--
-- Name: step_prototype_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.step_prototype_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_prototype_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.step_prototype_audit_id_seq OWNED BY audit.step_prototype_audit.id;


--
-- Name: tableslist; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.tableslist AS
 SELECT DISTINCT triggers.trigger_schema AS schema,
    triggers.event_object_table AS auditedtable
   FROM information_schema.triggers
  WHERE ((triggers.trigger_name)::text = ANY (ARRAY['audit_trigger_row'::text, 'audit_trigger_stm'::text]))
  ORDER BY triggers.trigger_schema, triggers.event_object_table;


--
-- Name: VIEW tableslist; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.tableslist IS '
	View showing all tables with auditing set up. Ordered by schema, then table.
	';


--
-- Name: template_audit; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.template_audit (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    context_id text NOT NULL,
    event_name text NOT NULL,
    template_id integer NOT NULL,
    user_id integer,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_system boolean
);


--
-- Name: template_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.template_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.template_audit_id_seq OWNED BY audit.template_audit.id;


--
-- Name: account_audit_logs; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.account_audit_logs (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    change_event jsonb DEFAULT '{}'::jsonb NOT NULL,
    account_id integer NOT NULL,
    account_user_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: account_audit_logs_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.account_audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.account_audit_logs_id_seq OWNED BY core.account_audit_logs.id;


--
-- Name: account_custom_api_events; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.account_custom_api_events (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_entity_id uuid NOT NULL,
    event_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    received_count integer,
    last_payload jsonb,
    first_seen_at timestamp with time zone,
    last_seen_at timestamp with time zone
);


--
-- Name: account_custom_api_events_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.account_custom_api_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_custom_api_events_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.account_custom_api_events_id_seq OWNED BY core.account_custom_api_events.id;


--
-- Name: account_roles; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.account_roles (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_id integer,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    organization_id integer NOT NULL
);


--
-- Name: account_roles_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.account_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.account_roles_id_seq OWNED BY core.account_roles.id;


--
-- Name: account_user_custom_api_events; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.account_user_custom_api_events (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_user_entity_id uuid NOT NULL,
    event_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    received_count integer,
    last_payload jsonb,
    first_seen_at timestamp with time zone,
    last_seen_at timestamp with time zone
);


--
-- Name: account_user_custom_api_events_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.account_user_custom_api_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_user_custom_api_events_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.account_user_custom_api_events_id_seq OWNED BY core.account_user_custom_api_events.id;


--
-- Name: account_users; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.account_users (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_id integer NOT NULL,
    external_id text NOT NULL,
    email text,
    full_name text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    organization_id integer NOT NULL,
    created_in_organization_at timestamp with time zone,
    attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    internal boolean DEFAULT false NOT NULL,
    properties jsonb NOT NULL
);


--
-- Name: account_users_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.account_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_users_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.account_users_id_seq OWNED BY core.account_users.id;


--
-- Name: accounts; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.accounts (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    external_id text,
    created_in_organization_at timestamp with time zone,
    primary_organization_user_id integer,
    attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    deleted_at timestamp with time zone,
    last_active_at timestamp with time zone,
    blocked_at timestamp with time zone,
    is_resetting boolean
);


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.accounts_id_seq OWNED BY core.accounts.id;


--
-- Name: audiences; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.audiences (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    auto_launch_rules jsonb DEFAULT '[]'::jsonb NOT NULL,
    targets jsonb DEFAULT '[]'::jsonb NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    edited_at timestamp with time zone,
    edited_by_user_id integer,
    deleted_at timestamp with time zone
);


--
-- Name: audiences_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.audiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audiences_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.audiences_id_seq OWNED BY core.audiences.id;


--
-- Name: auto_complete_interaction_guide_completions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.auto_complete_interaction_guide_completions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    auto_complete_interaction_id integer NOT NULL,
    template_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: auto_complete_interaction_guide_completions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.auto_complete_interaction_guide_completions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auto_complete_interaction_guide_completions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.auto_complete_interaction_guide_completions_id_seq OWNED BY core.auto_complete_interaction_guide_completions.id;


--
-- Name: auto_complete_interactions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.auto_complete_interactions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    interaction_type core.auto_complete_interaction_interaction_type NOT NULL,
    completable_type core.auto_complete_interaction_completable_type NOT NULL,
    completable_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: auto_complete_interactions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.auto_complete_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auto_complete_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.auto_complete_interactions_id_seq OWNED BY core.auto_complete_interactions.id;


--
-- Name: auto_launch_delete_log; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.auto_launch_delete_log (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    template_id integer NOT NULL,
    account_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: auto_launch_delete_log_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.auto_launch_delete_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auto_launch_delete_log_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.auto_launch_delete_log_id_seq OWNED BY core.auto_launch_delete_log.id;


--
-- Name: auto_launch_log; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.auto_launch_log (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    template_id integer NOT NULL,
    account_id integer NOT NULL,
    created_guide_base_id integer,
    matched_rules jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: auto_launch_log_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.auto_launch_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auto_launch_log_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.auto_launch_log_id_seq OWNED BY core.auto_launch_log.id;


--
-- Name: batched_notifications; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.batched_notifications (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    notification_type core.notification_type NOT NULL,
    recipient_email text NOT NULL,
    recipient_entity_id text NOT NULL,
    body_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: batched_notifications_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.batched_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: batched_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.batched_notifications_id_seq OWNED BY core.batched_notifications.id;


--
-- Name: branching_action_triggers; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.branching_action_triggers (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    branching_action_id integer NOT NULL,
    rules jsonb DEFAULT '[]'::jsonb NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    upon_completion_of_template_id integer,
    description text,
    upon_completion_of_step_prototype_id integer,
    upon_completion_of_module_id integer,
    upon_completion_of_origin_slate_node_id uuid
);


--
-- Name: branching_action_triggers_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.branching_action_triggers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branching_action_triggers_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.branching_action_triggers_id_seq OWNED BY core.branching_action_triggers.id;


--
-- Name: branching_actions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.branching_actions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    action_type core.branching_action_type NOT NULL,
    entity_type core.branching_entity_type NOT NULL,
    template_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text,
    module_id integer
);


--
-- Name: branching_actions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.branching_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branching_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.branching_actions_id_seq OWNED BY core.branching_actions.id;


--
-- Name: branching_paths; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.branching_paths (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    branching_key uuid NOT NULL,
    choice_key text NOT NULL,
    entity_type core.branching_entity_type DEFAULT 'module'::core.branching_entity_type NOT NULL,
    action_type core.branching_action_type DEFAULT 'create'::core.branching_action_type NOT NULL,
    template_id integer,
    module_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_index integer DEFAULT 0 NOT NULL
);


--
-- Name: branching_paths_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.branching_paths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branching_paths_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.branching_paths_id_seq OWNED BY core.branching_paths.id;


--
-- Name: custom_api_events; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.custom_api_events (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.custom_api_event_type DEFAULT 'event'::core.custom_api_event_type NOT NULL,
    last_seen timestamp with time zone,
    source text DEFAULT 'segment'::text,
    properties jsonb,
    debug_information jsonb
);


--
-- Name: custom_api_events_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.custom_api_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_api_events_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.custom_api_events_id_seq OWNED BY core.custom_api_events.id;


--
-- Name: custom_attribute_values; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.custom_attribute_values (
    id bigint NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    identifier_type core.custom_attribute_value_identifier_type,
    account_id integer,
    account_user_id integer,
    number_value bigint,
    text_value text,
    boolean_value boolean,
    date_value timestamp with time zone,
    custom_attribute_id bigint NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: custom_attribute_values_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.custom_attribute_values_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_attribute_values_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.custom_attribute_values_id_seq OWNED BY core.custom_attribute_values.id;


--
-- Name: custom_attributes; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.custom_attributes (
    id bigint NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    value_type core.attribute_value_type NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.attribute_type,
    source text DEFAULT 'snippet'::text
);


--
-- Name: custom_attributes_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.custom_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.custom_attributes_id_seq OWNED BY core.custom_attributes.id;


--
-- Name: feature_flag_default_orgs; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.feature_flag_default_orgs (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: feature_flag_default_orgs_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.feature_flag_default_orgs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_flag_default_orgs_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.feature_flag_default_orgs_id_seq OWNED BY core.feature_flag_default_orgs.id;


--
-- Name: feature_flag_enabled; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.feature_flag_enabled (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    feature_flag_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: feature_flag_enabled_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.feature_flag_enabled_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_flag_enabled_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.feature_flag_enabled_id_seq OWNED BY core.feature_flag_enabled.id;


--
-- Name: feature_flags; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.feature_flags (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    enabled_for_all boolean DEFAULT false,
    send_to_admin boolean DEFAULT false,
    send_to_embeddable boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    enabled_for_new_orgs boolean DEFAULT false NOT NULL
);


--
-- Name: feature_flags_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.feature_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.feature_flags_id_seq OWNED BY core.feature_flags.id;


--
-- Name: file_uploads; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.file_uploads (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    step_id integer NOT NULL,
    account_user_id integer NOT NULL,
    filename text NOT NULL,
    url text,
    slate_node_id text,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    original_filename text NOT NULL
);


--
-- Name: file_uploads_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.file_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.file_uploads_id_seq OWNED BY core.file_uploads.id;


--
-- Name: global_default_templates; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.global_default_templates (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: global_default_templates_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.global_default_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: global_default_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.global_default_templates_id_seq OWNED BY core.global_default_templates.id;


--
-- Name: google_auths; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.google_auths (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    external_id text NOT NULL,
    user_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: google_auths_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.google_auths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: google_auths_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.google_auths_id_seq OWNED BY core.google_auths.id;


--
-- Name: google_drive_uploader_auths; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.google_drive_uploader_auths (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    external_id text NOT NULL,
    email text NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


--
-- Name: google_drive_uploader_auths_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.google_drive_uploader_auths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: google_drive_uploader_auths_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.google_drive_uploader_auths_id_seq OWNED BY core.google_drive_uploader_auths.id;


--
-- Name: guide_base_step_auto_complete_interactions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_base_step_auto_complete_interactions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    guide_base_step_id integer NOT NULL,
    created_from_step_prototype_auto_complete_interaction_id integer,
    url text,
    wildcard_url text,
    type core.step_auto_complete_interaction_type,
    element_selector text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: guide_base_step_auto_complete_interactions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_base_step_auto_complete_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_base_step_auto_complete_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_base_step_auto_complete_interactions_id_seq OWNED BY core.guide_base_step_auto_complete_interactions.id;


--
-- Name: guide_base_step_ctas; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_base_step_ctas (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    guide_base_step_id integer NOT NULL,
    created_from_step_prototype_cta_id integer,
    type core.step_cta_type,
    style core.step_cta_style,
    text text,
    url text,
    order_index integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    launchable_template_id integer,
    settings jsonb
);


--
-- Name: guide_base_step_ctas_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_base_step_ctas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_base_step_ctas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_base_step_ctas_id_seq OWNED BY core.guide_base_step_ctas.id;


--
-- Name: guide_base_step_tagged_elements; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_base_step_tagged_elements (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    guide_base_step_id integer,
    element_selector text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.context_tag_type DEFAULT 'dot'::core.context_tag_type NOT NULL,
    alignment core.context_tag_alignment DEFAULT 'top_right'::core.context_tag_alignment NOT NULL,
    tooltip_alignment core.context_tag_tooltip_alignment DEFAULT 'right'::core.context_tag_tooltip_alignment NOT NULL,
    url text DEFAULT ''::text NOT NULL,
    wildcard_url text DEFAULT '.*'::text NOT NULL,
    x_offset integer DEFAULT 0 NOT NULL,
    y_offset integer DEFAULT 0 NOT NULL,
    relative_to_text boolean DEFAULT false NOT NULL,
    guide_base_id integer NOT NULL,
    created_from_prototype_id integer,
    style jsonb
);


--
-- Name: guide_base_step_tagged_elements_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_base_step_tagged_elements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_base_step_tagged_elements_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_base_step_tagged_elements_id_seq OWNED BY core.guide_base_step_tagged_elements.id;


--
-- Name: guide_bases; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_bases (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_id integer NOT NULL,
    created_from_template_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    state core.guide_base_state DEFAULT 'active'::core.guide_base_state NOT NULL,
    activated_at timestamp with time zone,
    is_modified_from_template boolean DEFAULT false NOT NULL,
    was_autolaunched boolean DEFAULT false NOT NULL,
    created_by_user_id integer,
    updated_by_user_id integer,
    obsoleted_at timestamp with time zone,
    created_from_split_test_id integer,
    deleted_at timestamp with time zone,
    exclude_from_user_targeting boolean,
    is_resetting boolean
);


--
-- Name: guide_bases_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_bases_id_seq OWNED BY core.guide_bases.id;


--
-- Name: guide_module_bases; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_module_bases (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    order_index integer NOT NULL,
    guide_base_id integer NOT NULL,
    created_from_module_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    should_only_add_to_new_guides_dynamically boolean DEFAULT false NOT NULL,
    added_dynamically_at timestamp with time zone,
    created_by_user_id integer,
    updated_by_user_id integer
);


--
-- Name: guide_module_bases_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_module_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_module_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_module_bases_id_seq OWNED BY core.guide_module_bases.id;


--
-- Name: guide_modules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_modules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    order_index integer NOT NULL,
    guide_id integer NOT NULL,
    created_from_module_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_from_guide_module_base_id integer NOT NULL,
    completed_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: guide_modules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_modules_id_seq OWNED BY core.guide_modules.id;


--
-- Name: guide_participants; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_participants (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    guide_id integer NOT NULL,
    account_user_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_viewed_at timestamp with time zone,
    done_at timestamp with time zone,
    saved_at timestamp with time zone,
    obsoleted_at timestamp with time zone,
    is_destination boolean DEFAULT false NOT NULL,
    created_from_guide_target_id integer,
    created_from_template_target_id integer
);


--
-- Name: guide_participants_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_participants_id_seq OWNED BY core.guide_participants.id;


--
-- Name: guide_step_bases; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_step_bases (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    body text,
    order_index integer NOT NULL,
    body_slate jsonb,
    guide_base_id integer NOT NULL,
    guide_module_base_id integer,
    created_from_step_prototype_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    step_type core.step_type,
    context_id text,
    cta_label text,
    cta_url text,
    branching_question text,
    branching_choices jsonb,
    branching_key text,
    dismiss_label text,
    branching_form_factor core.step_branching_form_factor,
    branching_multiple boolean,
    created_by_user_id integer,
    updated_by_user_id integer,
    manual_completion_disabled boolean,
    branching_dismiss_disabled boolean,
    deleted_at timestamp with time zone
);


--
-- Name: guide_step_bases_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_step_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_step_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_step_bases_id_seq OWNED BY core.guide_step_bases.id;


--
-- Name: guide_targets; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guide_targets (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    account_user_external_id text,
    account_user_email text,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    target_type core.guide_target_type,
    guide_base_id integer,
    rules jsonb DEFAULT '[]'::jsonb NOT NULL
);


--
-- Name: guide_targets_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guide_targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guide_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guide_targets_id_seq OWNED BY core.guide_targets.id;


--
-- Name: guides; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.guides (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    created_from_template_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    account_id integer NOT NULL,
    state core.guide_state DEFAULT 'draft'::core.guide_state NOT NULL,
    created_from_guide_base_id integer,
    launched_at timestamp with time zone,
    completed_at timestamp with time zone,
    last_active_at timestamp with time zone,
    completion_state core.guide_completion_state DEFAULT 'incomplete'::core.guide_completion_state,
    done_at timestamp with time zone,
    expire_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: guides_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guides_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.guides_id_seq OWNED BY core.guides.id;


--
-- Name: input_step_answers; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.input_step_answers (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    input_step_base_id integer,
    step_id integer,
    answered_by_account_user_id integer NOT NULL,
    answer text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: input_step_answers_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.input_step_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: input_step_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.input_step_answers_id_seq OWNED BY core.input_step_answers.id;


--
-- Name: input_step_bases; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.input_step_bases (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    guide_step_base_id integer NOT NULL,
    created_from_input_step_prototype_id integer,
    label text,
    type core.input_field_type NOT NULL,
    settings jsonb,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: input_step_bases_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.input_step_bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: input_step_bases_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.input_step_bases_id_seq OWNED BY core.input_step_bases.id;


--
-- Name: input_step_prototypes; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.input_step_prototypes (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    step_prototype_id integer NOT NULL,
    label text,
    type core.input_field_type NOT NULL,
    settings jsonb,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: input_step_prototypes_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.input_step_prototypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: input_step_prototypes_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.input_step_prototypes_id_seq OWNED BY core.input_step_prototypes.id;


--
-- Name: integration_api_keys; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.integration_api_keys (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    key text NOT NULL,
    type text NOT NULL,
    options jsonb DEFAULT '{}'::jsonb,
    last_error_at timestamp with time zone,
    integrated_at timestamp with time zone,
    state core.integration_states DEFAULT 'active'::core.integration_states,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    refresh_token text,
    targeting jsonb DEFAULT '{"account": {"type": "all", "rules": [], "grouping": "all"}, "accountUser": {"type": "all", "rules": [], "grouping": "all"}}'::jsonb NOT NULL,
    last_run_at timestamp with time zone
);


--
-- Name: integration_api_keys_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.integration_api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: integration_api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.integration_api_keys_id_seq OWNED BY core.integration_api_keys.id;


--
-- Name: integration_template_selections; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.integration_template_selections (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer NOT NULL,
    type text NOT NULL,
    options jsonb DEFAULT '{}'::jsonb,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: integration_template_selections_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.integration_template_selections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: integration_template_selections_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.integration_template_selections_id_seq OWNED BY core.integration_template_selections.id;


--
-- Name: internal_feature_flags; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.internal_feature_flags (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    strategy core.internal_feature_flag_states DEFAULT 'all'::core.internal_feature_flag_states,
    options jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: internal_feature_flags_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.internal_feature_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: internal_feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.internal_feature_flags_id_seq OWNED BY core.internal_feature_flags.id;


--
-- Name: media_references; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.media_references (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    media_id integer NOT NULL,
    reference_id integer NOT NULL,
    reference_type core.media_reference_type NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: media_references_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.media_references_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_references_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.media_references_id_seq OWNED BY core.media_references.id;


--
-- Name: medias; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.medias (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    type core.media_type NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    meta jsonb
);


--
-- Name: medias_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.medias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medias_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.medias_id_seq OWNED BY core.medias.id;


--
-- Name: module_auto_launch_rules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.module_auto_launch_rules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    module_id integer NOT NULL,
    rules jsonb DEFAULT '[]'::jsonb NOT NULL,
    state core.module_append_states DEFAULT 'active'::core.module_append_states,
    target_template_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: module_auto_launch_rules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.module_auto_launch_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: module_auto_launch_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.module_auto_launch_rules_id_seq OWNED BY core.module_auto_launch_rules.id;


--
-- Name: modules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.modules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    display_title text,
    description text,
    created_by_user_id integer,
    updated_by_user_id integer,
    is_cyoa boolean,
    created_from_form_factor core.form_factor,
    old_name text
);


--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.modules_id_seq OWNED BY core.modules.id;


--
-- Name: modules_step_prototypes; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.modules_step_prototypes (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    order_index integer NOT NULL,
    module_id integer NOT NULL,
    step_prototype_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: modules_step_prototypes_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.modules_step_prototypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modules_step_prototypes_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.modules_step_prototypes_id_seq OWNED BY core.modules_step_prototypes.id;


--
-- Name: nps_participants; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.nps_participants (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    nps_survey_instance_id integer,
    account_id integer,
    account_user_id integer NOT NULL,
    answer integer,
    fup_answer text,
    answered_at timestamp with time zone,
    dismissed_at timestamp with time zone,
    first_seen_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: nps_participants_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.nps_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nps_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.nps_participants_id_seq OWNED BY core.nps_participants.id;


--
-- Name: nps_survey_instances; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.nps_survey_instances (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    created_from_nps_survey_id integer,
    state core.nps_survey_state NOT NULL,
    total_answers integer DEFAULT 0 NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: nps_survey_instances_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.nps_survey_instances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nps_survey_instances_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.nps_survey_instances_id_seq OWNED BY core.nps_survey_instances.id;


--
-- Name: nps_surveys; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.nps_surveys (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    name text NOT NULL,
    form_factor core.nps_form_factor NOT NULL,
    form_factor_style jsonb,
    question text NOT NULL,
    fup_type core.nps_fup_type NOT NULL,
    fup_settings jsonb,
    start_at timestamp with time zone,
    ending_type core.nps_ending_type NOT NULL,
    end_at timestamp with time zone,
    end_after_total_answers integer,
    priority_ranking integer NOT NULL,
    page_targeting_type core.nps_page_targeting_type NOT NULL,
    page_targeting_url text,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    starting_type core.nps_starting_type NOT NULL,
    targets jsonb NOT NULL,
    launched_at timestamp with time zone,
    repeat_interval jsonb,
    state core.nps_state
);


--
-- Name: nps_surveys_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.nps_surveys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nps_surveys_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.nps_surveys_id_seq OWNED BY core.nps_surveys.id;


--
-- Name: organization_hosts; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.organization_hosts (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    hostname text NOT NULL
);


--
-- Name: organization_hosts_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.organization_hosts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_hosts_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.organization_hosts_id_seq OWNED BY core.organization_hosts.id;


--
-- Name: organization_inline_embeds; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.organization_inline_embeds (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    element_selector text NOT NULL,
    url text NOT NULL,
    wildcard_url text NOT NULL,
    "position" core.inline_embed_position NOT NULL,
    top_margin integer DEFAULT 0 NOT NULL,
    right_margin integer DEFAULT 0 NOT NULL,
    bottom_margin integer DEFAULT 0 NOT NULL,
    left_margin integer DEFAULT 0 NOT NULL,
    alignment core.inline_injection_alignment,
    max_width integer,
    targeting jsonb DEFAULT '{"account": {"type": "all", "rules": [], "grouping": "all"}, "accountUser": {"type": "all", "rules": [], "grouping": "all"}}'::jsonb NOT NULL,
    state core.inline_embed_state DEFAULT 'inactive'::core.inline_embed_state NOT NULL,
    padding integer DEFAULT 4 NOT NULL,
    border_radius integer DEFAULT 0 NOT NULL,
    template_id integer
);


--
-- Name: organization_inline_embeds_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.organization_inline_embeds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_inline_embeds_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.organization_inline_embeds_id_seq OWNED BY core.organization_inline_embeds.id;


--
-- Name: organization_settings; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.organization_settings (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    paragraph_font_size integer DEFAULT 14 NOT NULL,
    paragraph_line_height integer DEFAULT 20 NOT NULL,
    cyoa_background_color text DEFAULT 'FFFFFF'::text NOT NULL,
    cyoa_option_background_color text DEFAULT 'FFFFFF'::text NOT NULL,
    cyoa_text_color text DEFAULT '2D3748'::text NOT NULL,
    primary_color_hex text DEFAULT '73A4FC'::text NOT NULL,
    secondary_color_hex text DEFAULT 'EFF5FF'::text NOT NULL,
    embed_toggle_style core.embed_toggle_style DEFAULT 'progress_ring'::core.embed_toggle_style NOT NULL,
    embed_sidebar_side core.embed_sidebar_side DEFAULT 'right'::core.embed_sidebar_side NOT NULL,
    are_comments_disabled boolean DEFAULT false NOT NULL,
    is_sidebar_auto_open_on_first_view_disabled boolean DEFAULT false NOT NULL,
    logo_file_name text,
    is_embed_toggle_color_inverted boolean DEFAULT false NOT NULL,
    onboarding_url_path text,
    fallback_comments_email text,
    primary_guide_url text,
    google_drive_shared_folder_id text,
    embed_toggle_text text,
    embed_background_hex text DEFAULT '00000000'::text NOT NULL,
    embed_font_color_hex text,
    app_container_identifier text,
    send_email_notifications boolean DEFAULT false NOT NULL,
    embed_custom_css text,
    send_account_user_nudges boolean DEFAULT false NOT NULL,
    default_user_notification_url text,
    sidebar_style core.sidebar_style DEFAULT 'slide_out'::core.sidebar_style NOT NULL,
    tag_primary_color text DEFAULT 'E19E1A'::text NOT NULL,
    tag_text_color text DEFAULT 'FFFFFF'::text NOT NULL,
    tag_dot_size integer DEFAULT 6 NOT NULL,
    tag_badge_icon_padding integer DEFAULT 0 NOT NULL,
    tag_badge_icon_border_radius integer DEFAULT 20 NOT NULL,
    theme core.themes DEFAULT 'minimal'::core.themes NOT NULL,
    minimal_sidebar_size core.minimal_sidebar_sizes DEFAULT 'sm'::core.minimal_sidebar_sizes NOT NULL,
    floating_anchor_x_offset integer DEFAULT 0 NOT NULL,
    floating_anchor_y_offset integer DEFAULT 0 NOT NULL,
    embed_toggle_color_hex text DEFAULT '73A4FC'::text NOT NULL,
    step_completion_style text DEFAULT 'line-through'::text NOT NULL,
    inject_sidebar boolean DEFAULT true NOT NULL,
    cyoa_option_border_color text DEFAULT '00000000'::text NOT NULL,
    cyoa_option_shadow text DEFAULT '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'::text NOT NULL,
    cyoa_option_shadow_hover text DEFAULT '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'::text NOT NULL,
    sidebar_header jsonb DEFAULT '{"type": "bright", "closeIcon": "minimize", "progressBar": "sections", "showModuleNameInStepView": false}'::jsonb NOT NULL,
    tag_custom_icon_url text,
    sidebar_background_color text DEFAULT 'FFFFFF'::text NOT NULL,
    card_background_color text DEFAULT 'FFFFFF'::text NOT NULL,
    inline_empty_behavior core.inline_empty_behavior DEFAULT 'hide'::core.inline_empty_behavior NOT NULL,
    border_color text DEFAULT 'E2E8F0'::text NOT NULL,
    step_separation_style jsonb DEFAULT '{"type": "box", "boxBorderRadius": 8, "boxActiveStepShadow": "standard", "boxCompleteBackgroundColor": "#f9fafb"}'::jsonb NOT NULL,
    inline_contextual_style jsonb DEFAULT '{"shadow": "none", "padding": 16, "borderRadius": 8}'::jsonb NOT NULL,
    additional_colors jsonb DEFAULT '[]'::jsonb NOT NULL,
    sidebar_blocklisted_urls jsonb,
    sidebar_visibility core.sidebar_visibility DEFAULT 'show'::core.sidebar_visibility NOT NULL,
    all_guides_style jsonb DEFAULT '{"allGuidesTitle": "Resource center", "activeGuidesTitle": "Active guides", "previousGuidesTitle": "Previous guides", "previousAnnouncementsTitle": "Previous announcements"}'::jsonb NOT NULL,
    quick_links jsonb DEFAULT '[]'::jsonb,
    help_center jsonb,
    toggle_text_color text DEFAULT '000000'::text NOT NULL,
    embed_toggle_behavior core.embed_toggle_behavior DEFAULT 'default'::core.embed_toggle_behavior NOT NULL,
    tooltips_style jsonb,
    modals_style jsonb,
    banners_style jsonb,
    tag_visibility core.tag_visibility DEFAULT 'always'::core.tag_visibility NOT NULL,
    help_center_style jsonb,
    responsive_visibility jsonb,
    tag_pulse_level core.organization_settings_tag_pulse_level DEFAULT 'standard'::core.organization_settings_tag_pulse_level NOT NULL,
    ctas_style jsonb,
    sidebar_availability core.sidebar_availability DEFAULT 'default'::core.sidebar_availability NOT NULL
);


--
-- Name: organization_settings_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.organization_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.organization_settings_id_seq OWNED BY core.organization_settings.id;


--
-- Name: organizations; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.organizations (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    temp_active_guide_entity_id text,
    slug text NOT NULL,
    state core.organization_states DEFAULT 'active'::core.organization_states NOT NULL,
    domain text,
    trial_started_at timestamp with time zone,
    trial_ended_at timestamp with time zone,
    owned_by_user_id integer,
    allotted_guides integer DEFAULT 3,
    control_syncing boolean DEFAULT false,
    launching_cache_key text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    delete_at timestamp with time zone,
    options jsonb DEFAULT '{}'::jsonb,
    last_step_gpt_usage_at timestamp with time zone,
    plan core.organization_plan DEFAULT 'Starter'::core.organization_plan NOT NULL,
    test text,
    CONSTRAINT enforce_trial_dates_when_on_trial CHECK (((state <> 'trial'::core.organization_states) OR ((trial_started_at IS NOT NULL) AND (trial_ended_at IS NOT NULL)))),
    CONSTRAINT organizations_slug_check CHECK ((slug ~ '^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$'::text))
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.organizations_id_seq OWNED BY core.organizations.id;


--
-- Name: queued_cleanups; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.queued_cleanups (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: queued_cleanups_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.queued_cleanups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: queued_cleanups_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.queued_cleanups_id_seq OWNED BY core.queued_cleanups.id;


--
-- Name: segment_api_keys; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.segment_api_keys (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    key uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    are_track_events_enabled boolean DEFAULT true NOT NULL,
    are_identify_events_enabled boolean DEFAULT true NOT NULL,
    are_group_events_enabled boolean DEFAULT true NOT NULL,
    integrated_at timestamp with time zone,
    last_error_at timestamp with time zone,
    type text NOT NULL
);


--
-- Name: segment_api_keys_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.segment_api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: segment_api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.segment_api_keys_id_seq OWNED BY core.segment_api_keys.id;


--
-- Name: segment_examples; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.segment_examples (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    event_name text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_error text
);


--
-- Name: segment_examples_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.segment_examples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: segment_examples_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.segment_examples_id_seq OWNED BY core.segment_examples.id;


--
-- Name: slack_auths; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.slack_auths (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    bot_user_id text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: slack_auths_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.slack_auths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: slack_auths_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.slack_auths_id_seq OWNED BY core.slack_auths.id;


--
-- Name: step_auto_complete_interactions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_auto_complete_interactions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    step_id integer NOT NULL,
    created_from_guide_base_step_auto_complete_interaction_id integer,
    url text,
    wildcard_url text,
    type core.step_auto_complete_interaction_type,
    element_selector text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: step_auto_complete_interactions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_auto_complete_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_auto_complete_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_auto_complete_interactions_id_seq OWNED BY core.step_auto_complete_interactions.id;


--
-- Name: step_event_mapping_rules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_event_mapping_rules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    step_event_mapping_id integer NOT NULL,
    property_name text NOT NULL,
    value_type core.attribute_value_type NOT NULL,
    rule_type core.step_event_mapping_rule_type DEFAULT 'equals'::core.step_event_mapping_rule_type NOT NULL,
    number_value integer,
    text_value text,
    boolean_value boolean,
    date_value timestamp with time zone,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT step_event_mapping_rules_check CHECK ((((value_type = 'number'::core.attribute_value_type) AND (number_value IS NOT NULL)) OR ((value_type = 'text'::core.attribute_value_type) AND (text_value IS NOT NULL)) OR ((value_type = 'boolean'::core.attribute_value_type) AND (boolean_value IS NOT NULL)) OR ((value_type = 'date'::core.attribute_value_type) AND (date_value IS NOT NULL)))),
    CONSTRAINT step_event_mapping_rules_check1 CHECK ((((value_type = 'text'::core.attribute_value_type) AND (rule_type = 'equals'::core.step_event_mapping_rule_type)) OR ((value_type = 'boolean'::core.attribute_value_type) AND (rule_type = 'equals'::core.step_event_mapping_rule_type)) OR (value_type = 'date'::core.attribute_value_type) OR (value_type = 'number'::core.attribute_value_type)))
);


--
-- Name: step_event_mapping_rules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_event_mapping_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_event_mapping_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_event_mapping_rules_id_seq OWNED BY core.step_event_mapping_rules.id;


--
-- Name: step_event_mappings; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_event_mappings (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    event_name text NOT NULL,
    step_prototype_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    complete_for_whole_account boolean DEFAULT false NOT NULL
);


--
-- Name: step_event_mappings_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_event_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_event_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_event_mappings_id_seq OWNED BY core.step_event_mappings.id;


--
-- Name: step_participants; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_participants (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    step_id integer NOT NULL,
    account_user_id integer NOT NULL,
    organization_id integer NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    first_viewed_at timestamp with time zone,
    skipped_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: step_participants_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_participants_id_seq OWNED BY core.step_participants.id;


--
-- Name: step_prototype_auto_complete_interactions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_prototype_auto_complete_interactions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    step_prototype_id integer NOT NULL,
    url text DEFAULT '.*'::text NOT NULL,
    wildcard_url text DEFAULT '.*'::text NOT NULL,
    type core.step_auto_complete_interaction_type DEFAULT 'click'::core.step_auto_complete_interaction_type NOT NULL,
    element_selector text NOT NULL,
    element_text text,
    element_html text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: step_prototype_auto_complete_interactions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_prototype_auto_complete_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_prototype_auto_complete_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_prototype_auto_complete_interactions_id_seq OWNED BY core.step_prototype_auto_complete_interactions.id;


--
-- Name: step_prototype_ctas; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_prototype_ctas (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    step_prototype_id integer NOT NULL,
    type core.step_cta_type DEFAULT 'complete'::core.step_cta_type NOT NULL,
    style core.step_cta_style DEFAULT 'solid'::core.step_cta_style NOT NULL,
    text text NOT NULL,
    url text,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    launchable_template_id integer,
    settings jsonb DEFAULT '{"bgColorField": "primaryColorHex", "textColorField": "white"}'::jsonb NOT NULL
);


--
-- Name: step_prototype_ctas_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_prototype_ctas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_prototype_ctas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_prototype_ctas_id_seq OWNED BY core.step_prototype_ctas.id;


--
-- Name: step_prototype_tagged_elements; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_prototype_tagged_elements (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    step_prototype_id integer,
    element_selector text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.context_tag_type DEFAULT 'dot'::core.context_tag_type NOT NULL,
    alignment core.context_tag_alignment DEFAULT 'top_right'::core.context_tag_alignment NOT NULL,
    tooltip_alignment core.context_tag_tooltip_alignment DEFAULT 'right'::core.context_tag_tooltip_alignment NOT NULL,
    url text DEFAULT ''::text NOT NULL,
    wildcard_url text DEFAULT '.*'::text NOT NULL,
    x_offset integer DEFAULT 0 NOT NULL,
    y_offset integer DEFAULT 0 NOT NULL,
    relative_to_text boolean DEFAULT false NOT NULL,
    template_id integer NOT NULL,
    element_text text,
    element_html text,
    style jsonb
);


--
-- Name: step_prototype_tagged_elements_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_prototype_tagged_elements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_prototype_tagged_elements_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_prototype_tagged_elements_id_seq OWNED BY core.step_prototype_tagged_elements.id;


--
-- Name: step_prototypes; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_prototypes (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text NOT NULL,
    body text,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    body_slate jsonb,
    is_flow_based boolean DEFAULT false NOT NULL,
    input_type core.input_type,
    step_type core.step_type DEFAULT 'required'::core.step_type,
    context_id text,
    cta_label text,
    cta_url text,
    branching_question text,
    branching_choices jsonb,
    branching_key text,
    dismiss_label text,
    branching_form_factor core.step_branching_form_factor,
    branching_multiple boolean DEFAULT false NOT NULL,
    created_by_user_id integer,
    updated_by_user_id integer,
    manual_completion_disabled boolean,
    branching_dismiss_disabled boolean,
    snappy_at timestamp with time zone
);


--
-- Name: step_prototypes_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_prototypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_prototypes_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_prototypes_id_seq OWNED BY core.step_prototypes.id;


--
-- Name: step_tagged_element_participants; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_tagged_element_participants (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    step_tagged_element_id integer NOT NULL,
    account_user_id integer NOT NULL,
    organization_id integer NOT NULL,
    dismissed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: step_tagged_element_participants_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_tagged_element_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_tagged_element_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_tagged_element_participants_id_seq OWNED BY core.step_tagged_element_participants.id;


--
-- Name: step_tagged_elements; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.step_tagged_elements (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    step_id integer,
    element_selector text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.context_tag_type DEFAULT 'dot'::core.context_tag_type NOT NULL,
    alignment core.context_tag_alignment DEFAULT 'top_right'::core.context_tag_alignment NOT NULL,
    tooltip_alignment core.context_tag_tooltip_alignment DEFAULT 'right'::core.context_tag_tooltip_alignment NOT NULL,
    url text DEFAULT ''::text NOT NULL,
    wildcard_url text DEFAULT '.*'::text NOT NULL,
    x_offset integer DEFAULT 0 NOT NULL,
    y_offset integer DEFAULT 0 NOT NULL,
    relative_to_text boolean DEFAULT false NOT NULL,
    guide_id integer,
    created_from_base_id integer,
    style jsonb,
    guide_base_id integer,
    guide_base_step_id integer,
    created_from_prototype_id integer
);


--
-- Name: step_tagged_elements_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.step_tagged_elements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: step_tagged_elements_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.step_tagged_elements_id_seq OWNED BY core.step_tagged_elements.id;


--
-- Name: steps; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.steps (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    body text,
    order_index integer,
    guide_module_id integer NOT NULL,
    created_from_step_prototype_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_complete boolean DEFAULT false NOT NULL,
    guide_id integer NOT NULL,
    body_slate jsonb,
    input_type core.input_type,
    created_from_guide_step_base_id integer NOT NULL,
    completed_at timestamp with time zone,
    completed_by_type core.step_completed_by_type,
    completed_by_user_id integer,
    completed_by_account_user_id integer,
    step_type core.step_type,
    context_id text,
    notified_at timestamp with time zone,
    cta_label text,
    cta_url text,
    branching_question text,
    branching_choices jsonb,
    branching_key text,
    dismiss_label text,
    branching_form_factor core.step_branching_form_factor,
    branching_multiple boolean,
    manual_completion_disabled boolean,
    branching_dismiss_disabled boolean
);


--
-- Name: steps_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: steps_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.steps_id_seq OWNED BY core.steps.id;


--
-- Name: template_audiences; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.template_audiences (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    group_index integer NOT NULL,
    rule_type text NOT NULL,
    template_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    audience_entity_id uuid NOT NULL
);


--
-- Name: template_audiences_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.template_audiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_audiences_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.template_audiences_id_seq OWNED BY core.template_audiences.id;


--
-- Name: template_auto_launch_rules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.template_auto_launch_rules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer NOT NULL,
    rules jsonb DEFAULT '[]'::jsonb NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    rule_type core.template_auto_launch_rule_type DEFAULT 'all'::core.template_auto_launch_rule_type NOT NULL
);


--
-- Name: template_auto_launch_rules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.template_auto_launch_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_auto_launch_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.template_auto_launch_rules_id_seq OWNED BY core.template_auto_launch_rules.id;


--
-- Name: template_split_targets; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.template_split_targets (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    source_template_id integer NOT NULL,
    destination_template_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    triggered_times integer DEFAULT 0
);


--
-- Name: template_split_targets_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.template_split_targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_split_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.template_split_targets_id_seq OWNED BY core.template_split_targets.id;


--
-- Name: template_targets; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.template_targets (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    target_type core.template_target_type NOT NULL,
    template_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    rules jsonb DEFAULT '[]'::jsonb NOT NULL
);


--
-- Name: template_targets_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.template_targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: template_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.template_targets_id_seq OWNED BY core.template_targets.id;


--
-- Name: templates; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.templates (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    description text,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.guide_type DEFAULT 'account'::core.guide_type NOT NULL,
    auto_launch_for_accounts_created_after timestamp with time zone,
    auto_launch_for_account_users_created_after timestamp with time zone,
    auto_launch_for_all_accounts boolean DEFAULT false NOT NULL,
    priority_ranking integer DEFAULT 999 NOT NULL,
    display_title text,
    is_auto_launch_enabled boolean DEFAULT false NOT NULL,
    allowed_embed_type core.allowed_embed_type,
    is_side_quest boolean DEFAULT false NOT NULL,
    form_factor core.form_factor DEFAULT 'inline_sidebar'::core.form_factor NOT NULL,
    page_targeting_url text,
    created_by_user_id integer,
    updated_by_user_id integer,
    page_targeting_type core.page_targeting_type DEFAULT 'any_page'::core.page_targeting_type NOT NULL,
    is_template boolean DEFAULT false NOT NULL,
    theme core.themes DEFAULT 'standard'::core.themes NOT NULL,
    form_factor_style jsonb,
    enable_auto_launch_at timestamp with time zone,
    disable_auto_launch_at timestamp with time zone,
    archived_at timestamp with time zone,
    is_cyoa boolean,
    notification_settings jsonb DEFAULT '{}'::jsonb,
    private_name text,
    expire_based_on core.guide_expiration_criteria,
    expire_after integer,
    is_resetting boolean,
    deleted_at timestamp with time zone,
    state core.template_state NOT NULL,
    manually_launched boolean,
    edited_at timestamp with time zone,
    edited_by_user_id integer,
    last_used_at timestamp with time zone,
    targeting_set timestamp with time zone
);


--
-- Name: COLUMN templates.targeting_set; Type: COMMENT; Schema: core; Owner: -
--

COMMENT ON COLUMN core.templates.targeting_set IS 'Any dates before Jan 2024 are backfilled and not accurate.';


--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: templates_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.templates_id_seq OWNED BY core.templates.id;


--
-- Name: templates_modules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.templates_modules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer NOT NULL,
    module_id integer NOT NULL,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_index integer NOT NULL
);


--
-- Name: templates_modules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.templates_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: templates_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.templates_modules_id_seq OWNED BY core.templates_modules.id;


--
-- Name: triggered_branching_actions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.triggered_branching_actions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    branching_action_id integer NOT NULL,
    branching_action_trigger_id integer,
    created_guide_id integer,
    account_user_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    triggered_from_guide_id integer,
    triggered_from_step_id integer,
    triggered_from_guide_module_id integer,
    created_guide_module_id integer,
    triggered_from_slate_node_id uuid,
    created_guide_module_base_id integer
);


--
-- Name: triggered_branching_actions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.triggered_branching_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: triggered_branching_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.triggered_branching_actions_id_seq OWNED BY core.triggered_branching_actions.id;


--
-- Name: triggered_branching_paths; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.triggered_branching_paths (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    branching_path_id integer,
    created_guide_id integer,
    created_guide_module_id integer,
    created_guide_module_base_id integer,
    account_user_id integer,
    triggered_from_guide_id integer,
    triggered_from_step_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    data jsonb
);


--
-- Name: triggered_branching_paths_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.triggered_branching_paths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: triggered_branching_paths_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.triggered_branching_paths_id_seq OWNED BY core.triggered_branching_paths.id;


--
-- Name: triggered_dynamic_modules; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.triggered_dynamic_modules (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    module_auto_launch_rule integer,
    created_guide_module_base_id integer,
    created_guide_module_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: triggered_dynamic_modules_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.triggered_dynamic_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: triggered_dynamic_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.triggered_dynamic_modules_id_seq OWNED BY core.triggered_dynamic_modules.id;


--
-- Name: triggered_launch_ctas; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.triggered_launch_ctas (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    created_guide_id integer NOT NULL,
    triggered_from_step_id integer NOT NULL,
    triggered_from_guide_id integer NOT NULL,
    triggered_from_guide_base_cta_id integer,
    account_user_id integer,
    organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: triggered_launch_ctas_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.triggered_launch_ctas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: triggered_launch_ctas_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.triggered_launch_ctas_id_seq OWNED BY core.triggered_launch_ctas.id;


--
-- Name: user_auths; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.user_auths (
    id integer NOT NULL,
    entity_id text DEFAULT public.uuid_generate_v1mc() NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    type core.auth_type NOT NULL,
    user_id integer NOT NULL,
    key text NOT NULL
);


--
-- Name: user_auths_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.user_auths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_auths_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.user_auths_id_seq OWNED BY core.user_auths.id;


--
-- Name: user_deny_list; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.user_deny_list (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: user_deny_list_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.user_deny_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_deny_list_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.user_deny_list_id_seq OWNED BY core.user_deny_list.id;


--
-- Name: users; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.users (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_superadmin boolean DEFAULT false NOT NULL,
    full_name text,
    phone_number text,
    avatar_file_name text,
    organization_id integer,
    google_auth_id integer,
    status core.user_status DEFAULT 'active'::core.user_status NOT NULL,
    extra jsonb,
    sessions_valid_from timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.users_id_seq OWNED BY core.users.id;


--
-- Name: users_organizations; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.users_organizations (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    user_id integer NOT NULL,
    organization_id integer NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: users_organizations_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.users_organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.users_organizations_id_seq OWNED BY core.users_organizations.id;


--
-- Name: visual_builder_sessions; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.visual_builder_sessions (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    user_id integer NOT NULL,
    type core.visual_builder_session_type NOT NULL,
    state core.visual_builder_session_state NOT NULL,
    initial_data jsonb NOT NULL,
    progress_data jsonb,
    preview_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: visual_builder_sessions_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.visual_builder_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visual_builder_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.visual_builder_sessions_id_seq OWNED BY core.visual_builder_sessions.id;


--
-- Name: webhooks; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.webhooks (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    organization_id integer NOT NULL,
    event_type text NOT NULL,
    secret_key text,
    webhook_url text NOT NULL,
    last_error text,
    state core.webhook_states DEFAULT 'active'::core.webhook_states,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by_user_id integer,
    updated_by_user_id integer,
    webhook_type core.webhook_type DEFAULT 'standard'::core.webhook_type NOT NULL
);


--
-- Name: webhooks_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.webhooks_id_seq OWNED BY core.webhooks.id;


--
-- Name: backfill_clicked_events_of_launch_type_ctas; Type: TABLE; Schema: debug; Owner: -
--

CREATE TABLE debug.backfill_clicked_events_of_launch_type_ctas (
    id integer,
    event_name text,
    organization_entity_id uuid,
    account_user_entity_id uuid,
    user_entity_id uuid,
    step_entity_id uuid,
    location text,
    completed_by_type core.step_completed_by_type,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: guide_step_base_backup; Type: TABLE; Schema: debug; Owner: -
--

CREATE TABLE debug.guide_step_base_backup (
    id integer,
    entity_id uuid,
    name text,
    body text,
    order_index integer,
    is_flow_based boolean,
    body_slate jsonb,
    guide_base_id integer,
    guide_module_base_id integer,
    created_from_step_prototype_id integer,
    organization_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    step_type core.step_type,
    context_id text,
    cta_label text,
    cta_url text,
    branching_question text,
    branching_choices jsonb,
    branching_key text,
    dismiss_label text,
    branching_form_factor core.step_branching_form_factor,
    branching_multiple boolean,
    created_by_user_id integer,
    updated_by_user_id integer,
    manual_completion_disabled boolean
);


--
-- Name: launch_reports; Type: TABLE; Schema: debug; Owner: -
--

CREATE TABLE debug.launch_reports (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    template_id integer,
    account_id integer,
    account_user_id integer,
    organization_id integer NOT NULL,
    report jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: launch_reports_id_seq; Type: SEQUENCE; Schema: debug; Owner: -
--

CREATE SEQUENCE debug.launch_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: launch_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: debug; Owner: -
--

ALTER SEQUENCE debug.launch_reports_id_seq OWNED BY debug.launch_reports.id;


--
-- Name: ranking_backup; Type: TABLE; Schema: debug; Owner: -
--

CREATE TABLE debug.ranking_backup (
    id integer,
    priority_ranking integer
);


--
-- Name: report_dumps; Type: TABLE; Schema: debug; Owner: -
--

CREATE TABLE debug.report_dumps (
    id integer NOT NULL,
    entity_id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    json jsonb
);


--
-- Name: report_dumps_id_seq; Type: SEQUENCE; Schema: debug; Owner: -
--

CREATE SEQUENCE debug.report_dumps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: report_dumps_id_seq; Type: SEQUENCE OWNED BY; Schema: debug; Owner: -
--

ALTER SEQUENCE debug.report_dumps_id_seq OWNED BY debug.report_dumps.id;


--
-- Name: templates_name_cleanup_snapshot_up_23_02_2023_17_23_40; Type: TABLE; Schema: debug; Owner: -
--

CREATE TABLE debug.templates_name_cleanup_snapshot_up_23_02_2023_17_23_40 (
    id integer,
    entity_id uuid,
    organization_id integer,
    name text,
    display_title text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: account_user_daily_log id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_daily_log ALTER COLUMN id SET DEFAULT nextval('analytics.account_user_daily_log_id_seq'::regclass);


--
-- Name: account_user_data id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_data ALTER COLUMN id SET DEFAULT nextval('analytics.account_user_data_id_seq'::regclass);


--
-- Name: account_user_events id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_events ALTER COLUMN id SET DEFAULT nextval('analytics.account_user_events_id_seq'::regclass);


--
-- Name: announcement_daily_activity id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.announcement_daily_activity ALTER COLUMN id SET DEFAULT nextval('analytics.announcement_daily_activity_id_seq'::regclass);


--
-- Name: captured_guide_analytics id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.captured_guide_analytics ALTER COLUMN id SET DEFAULT nextval('analytics.captured_guide_analytics_id_seq'::regclass);


--
-- Name: data_usage id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.data_usage ALTER COLUMN id SET DEFAULT nextval('analytics.data_usage_id_seq'::regclass);


--
-- Name: diagnostics_events id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.diagnostics_events ALTER COLUMN id SET DEFAULT nextval('analytics.diagnostics_events_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.events ALTER COLUMN id SET DEFAULT nextval('analytics.events_id_seq'::regclass);


--
-- Name: feature_events id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.feature_events ALTER COLUMN id SET DEFAULT nextval('analytics.feature_events_id_seq'::regclass);


--
-- Name: guide_daily_rollup id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_daily_rollup ALTER COLUMN id SET DEFAULT nextval('analytics.guide_daily_rollup_id_seq'::regclass);


--
-- Name: guide_data id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_data ALTER COLUMN id SET DEFAULT nextval('analytics.guide_data_id_seq'::regclass);


--
-- Name: guide_events id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_events ALTER COLUMN id SET DEFAULT nextval('analytics.guide_events_id_seq'::regclass);


--
-- Name: organization_data id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.organization_data ALTER COLUMN id SET DEFAULT nextval('analytics.organization_data_id_seq'::regclass);


--
-- Name: rollup_states id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.rollup_states ALTER COLUMN id SET DEFAULT nextval('analytics.rollup_states_id_seq'::regclass);


--
-- Name: step_daily_rollup id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_daily_rollup ALTER COLUMN id SET DEFAULT nextval('analytics.step_daily_rollup_id_seq'::regclass);


--
-- Name: step_data id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_data ALTER COLUMN id SET DEFAULT nextval('analytics.step_data_id_seq'::regclass);


--
-- Name: step_events id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_events ALTER COLUMN id SET DEFAULT nextval('analytics.step_events_id_seq'::regclass);


--
-- Name: template_data id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.template_data ALTER COLUMN id SET DEFAULT nextval('analytics.template_data_id_seq'::regclass);


--
-- Name: value_data id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data ALTER COLUMN id SET DEFAULT nextval('analytics.value_data_id_seq'::regclass);


--
-- Name: value_data_aggregate id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data_aggregate ALTER COLUMN id SET DEFAULT nextval('analytics.value_data_aggregate_id_seq'::regclass);


--
-- Name: account_audit id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.account_audit ALTER COLUMN id SET DEFAULT nextval('audit.account_audit_id_seq'::regclass);


--
-- Name: auth_audit id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.auth_audit ALTER COLUMN id SET DEFAULT nextval('audit.auth_audit_id_seq'::regclass);


--
-- Name: deleted_users id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.deleted_users ALTER COLUMN id SET DEFAULT nextval('audit.deleted_users_id_seq'::regclass);


--
-- Name: guide_base_audit id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.guide_base_audit ALTER COLUMN id SET DEFAULT nextval('audit.guide_base_audit_id_seq'::regclass);


--
-- Name: logged_actions event_id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.logged_actions ALTER COLUMN event_id SET DEFAULT nextval('audit.logged_actions_event_id_seq'::regclass);


--
-- Name: module_audit id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.module_audit ALTER COLUMN id SET DEFAULT nextval('audit.module_audit_id_seq'::regclass);


--
-- Name: step_prototype_audit id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.step_prototype_audit ALTER COLUMN id SET DEFAULT nextval('audit.step_prototype_audit_id_seq'::regclass);


--
-- Name: template_audit id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.template_audit ALTER COLUMN id SET DEFAULT nextval('audit.template_audit_id_seq'::regclass);


--
-- Name: account_audit_logs id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_audit_logs ALTER COLUMN id SET DEFAULT nextval('core.account_audit_logs_id_seq'::regclass);


--
-- Name: account_custom_api_events id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_custom_api_events ALTER COLUMN id SET DEFAULT nextval('core.account_custom_api_events_id_seq'::regclass);


--
-- Name: account_roles id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_roles ALTER COLUMN id SET DEFAULT nextval('core.account_roles_id_seq'::regclass);


--
-- Name: account_user_custom_api_events id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_user_custom_api_events ALTER COLUMN id SET DEFAULT nextval('core.account_user_custom_api_events_id_seq'::regclass);


--
-- Name: account_users id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_users ALTER COLUMN id SET DEFAULT nextval('core.account_users_id_seq'::regclass);


--
-- Name: accounts id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.accounts ALTER COLUMN id SET DEFAULT nextval('core.accounts_id_seq'::regclass);


--
-- Name: audiences id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.audiences ALTER COLUMN id SET DEFAULT nextval('core.audiences_id_seq'::regclass);


--
-- Name: auto_complete_interaction_guide_completions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interaction_guide_completions ALTER COLUMN id SET DEFAULT nextval('core.auto_complete_interaction_guide_completions_id_seq'::regclass);


--
-- Name: auto_complete_interactions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interactions ALTER COLUMN id SET DEFAULT nextval('core.auto_complete_interactions_id_seq'::regclass);


--
-- Name: auto_launch_delete_log id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_delete_log ALTER COLUMN id SET DEFAULT nextval('core.auto_launch_delete_log_id_seq'::regclass);


--
-- Name: auto_launch_log id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log ALTER COLUMN id SET DEFAULT nextval('core.auto_launch_log_id_seq'::regclass);


--
-- Name: batched_notifications id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.batched_notifications ALTER COLUMN id SET DEFAULT nextval('core.batched_notifications_id_seq'::regclass);


--
-- Name: branching_action_triggers id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers ALTER COLUMN id SET DEFAULT nextval('core.branching_action_triggers_id_seq'::regclass);


--
-- Name: branching_actions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_actions ALTER COLUMN id SET DEFAULT nextval('core.branching_actions_id_seq'::regclass);


--
-- Name: branching_paths id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_paths ALTER COLUMN id SET DEFAULT nextval('core.branching_paths_id_seq'::regclass);


--
-- Name: custom_api_events id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_api_events ALTER COLUMN id SET DEFAULT nextval('core.custom_api_events_id_seq'::regclass);


--
-- Name: custom_attribute_values id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values ALTER COLUMN id SET DEFAULT nextval('core.custom_attribute_values_id_seq'::regclass);


--
-- Name: custom_attributes id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attributes ALTER COLUMN id SET DEFAULT nextval('core.custom_attributes_id_seq'::regclass);


--
-- Name: feature_flag_default_orgs id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_default_orgs ALTER COLUMN id SET DEFAULT nextval('core.feature_flag_default_orgs_id_seq'::regclass);


--
-- Name: feature_flag_enabled id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_enabled ALTER COLUMN id SET DEFAULT nextval('core.feature_flag_enabled_id_seq'::regclass);


--
-- Name: feature_flags id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flags ALTER COLUMN id SET DEFAULT nextval('core.feature_flags_id_seq'::regclass);


--
-- Name: file_uploads id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.file_uploads ALTER COLUMN id SET DEFAULT nextval('core.file_uploads_id_seq'::regclass);


--
-- Name: global_default_templates id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.global_default_templates ALTER COLUMN id SET DEFAULT nextval('core.global_default_templates_id_seq'::regclass);


--
-- Name: google_auths id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_auths ALTER COLUMN id SET DEFAULT nextval('core.google_auths_id_seq'::regclass);


--
-- Name: google_drive_uploader_auths id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_drive_uploader_auths ALTER COLUMN id SET DEFAULT nextval('core.google_drive_uploader_auths_id_seq'::regclass);


--
-- Name: guide_base_step_auto_complete_interactions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_auto_complete_interactions ALTER COLUMN id SET DEFAULT nextval('core.guide_base_step_auto_complete_interactions_id_seq'::regclass);


--
-- Name: guide_base_step_ctas id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas ALTER COLUMN id SET DEFAULT nextval('core.guide_base_step_ctas_id_seq'::regclass);


--
-- Name: guide_base_step_tagged_elements id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements ALTER COLUMN id SET DEFAULT nextval('core.guide_base_step_tagged_elements_id_seq'::regclass);


--
-- Name: guide_bases id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases ALTER COLUMN id SET DEFAULT nextval('core.guide_bases_id_seq'::regclass);


--
-- Name: guide_module_bases id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases ALTER COLUMN id SET DEFAULT nextval('core.guide_module_bases_id_seq'::regclass);


--
-- Name: guide_modules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules ALTER COLUMN id SET DEFAULT nextval('core.guide_modules_id_seq'::regclass);


--
-- Name: guide_participants id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants ALTER COLUMN id SET DEFAULT nextval('core.guide_participants_id_seq'::regclass);


--
-- Name: guide_step_bases id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases ALTER COLUMN id SET DEFAULT nextval('core.guide_step_bases_id_seq'::regclass);


--
-- Name: guide_targets id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_targets ALTER COLUMN id SET DEFAULT nextval('core.guide_targets_id_seq'::regclass);


--
-- Name: guides id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides ALTER COLUMN id SET DEFAULT nextval('core.guides_id_seq'::regclass);


--
-- Name: input_step_answers id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers ALTER COLUMN id SET DEFAULT nextval('core.input_step_answers_id_seq'::regclass);


--
-- Name: input_step_bases id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_bases ALTER COLUMN id SET DEFAULT nextval('core.input_step_bases_id_seq'::regclass);


--
-- Name: input_step_prototypes id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_prototypes ALTER COLUMN id SET DEFAULT nextval('core.input_step_prototypes_id_seq'::regclass);


--
-- Name: integration_api_keys id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_api_keys ALTER COLUMN id SET DEFAULT nextval('core.integration_api_keys_id_seq'::regclass);


--
-- Name: integration_template_selections id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_template_selections ALTER COLUMN id SET DEFAULT nextval('core.integration_template_selections_id_seq'::regclass);


--
-- Name: internal_feature_flags id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.internal_feature_flags ALTER COLUMN id SET DEFAULT nextval('core.internal_feature_flags_id_seq'::regclass);


--
-- Name: media_references id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.media_references ALTER COLUMN id SET DEFAULT nextval('core.media_references_id_seq'::regclass);


--
-- Name: medias id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.medias ALTER COLUMN id SET DEFAULT nextval('core.medias_id_seq'::regclass);


--
-- Name: module_auto_launch_rules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.module_auto_launch_rules ALTER COLUMN id SET DEFAULT nextval('core.module_auto_launch_rules_id_seq'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules ALTER COLUMN id SET DEFAULT nextval('core.modules_id_seq'::regclass);


--
-- Name: modules_step_prototypes id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules_step_prototypes ALTER COLUMN id SET DEFAULT nextval('core.modules_step_prototypes_id_seq'::regclass);


--
-- Name: nps_participants id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants ALTER COLUMN id SET DEFAULT nextval('core.nps_participants_id_seq'::regclass);


--
-- Name: nps_survey_instances id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_survey_instances ALTER COLUMN id SET DEFAULT nextval('core.nps_survey_instances_id_seq'::regclass);


--
-- Name: nps_surveys id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_surveys ALTER COLUMN id SET DEFAULT nextval('core.nps_surveys_id_seq'::regclass);


--
-- Name: organization_hosts id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_hosts ALTER COLUMN id SET DEFAULT nextval('core.organization_hosts_id_seq'::regclass);


--
-- Name: organization_inline_embeds id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_inline_embeds ALTER COLUMN id SET DEFAULT nextval('core.organization_inline_embeds_id_seq'::regclass);


--
-- Name: organization_settings id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_settings ALTER COLUMN id SET DEFAULT nextval('core.organization_settings_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organizations ALTER COLUMN id SET DEFAULT nextval('core.organizations_id_seq'::regclass);


--
-- Name: queued_cleanups id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.queued_cleanups ALTER COLUMN id SET DEFAULT nextval('core.queued_cleanups_id_seq'::regclass);


--
-- Name: segment_api_keys id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_api_keys ALTER COLUMN id SET DEFAULT nextval('core.segment_api_keys_id_seq'::regclass);


--
-- Name: segment_examples id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_examples ALTER COLUMN id SET DEFAULT nextval('core.segment_examples_id_seq'::regclass);


--
-- Name: slack_auths id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.slack_auths ALTER COLUMN id SET DEFAULT nextval('core.slack_auths_id_seq'::regclass);


--
-- Name: step_auto_complete_interactions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_auto_complete_interactions ALTER COLUMN id SET DEFAULT nextval('core.step_auto_complete_interactions_id_seq'::regclass);


--
-- Name: step_event_mapping_rules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mapping_rules ALTER COLUMN id SET DEFAULT nextval('core.step_event_mapping_rules_id_seq'::regclass);


--
-- Name: step_event_mappings id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mappings ALTER COLUMN id SET DEFAULT nextval('core.step_event_mappings_id_seq'::regclass);


--
-- Name: step_participants id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_participants ALTER COLUMN id SET DEFAULT nextval('core.step_participants_id_seq'::regclass);


--
-- Name: step_prototype_auto_complete_interactions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_auto_complete_interactions ALTER COLUMN id SET DEFAULT nextval('core.step_prototype_auto_complete_interactions_id_seq'::regclass);


--
-- Name: step_prototype_ctas id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_ctas ALTER COLUMN id SET DEFAULT nextval('core.step_prototype_ctas_id_seq'::regclass);


--
-- Name: step_prototype_tagged_elements id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_tagged_elements ALTER COLUMN id SET DEFAULT nextval('core.step_prototype_tagged_elements_id_seq'::regclass);


--
-- Name: step_prototypes id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes ALTER COLUMN id SET DEFAULT nextval('core.step_prototypes_id_seq'::regclass);


--
-- Name: step_tagged_element_participants id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_element_participants ALTER COLUMN id SET DEFAULT nextval('core.step_tagged_element_participants_id_seq'::regclass);


--
-- Name: step_tagged_elements id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements ALTER COLUMN id SET DEFAULT nextval('core.step_tagged_elements_id_seq'::regclass);


--
-- Name: steps id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps ALTER COLUMN id SET DEFAULT nextval('core.steps_id_seq'::regclass);


--
-- Name: template_audiences id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_audiences ALTER COLUMN id SET DEFAULT nextval('core.template_audiences_id_seq'::regclass);


--
-- Name: template_auto_launch_rules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_auto_launch_rules ALTER COLUMN id SET DEFAULT nextval('core.template_auto_launch_rules_id_seq'::regclass);


--
-- Name: template_split_targets id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_split_targets ALTER COLUMN id SET DEFAULT nextval('core.template_split_targets_id_seq'::regclass);


--
-- Name: template_targets id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_targets ALTER COLUMN id SET DEFAULT nextval('core.template_targets_id_seq'::regclass);


--
-- Name: templates id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates ALTER COLUMN id SET DEFAULT nextval('core.templates_id_seq'::regclass);


--
-- Name: templates_modules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules ALTER COLUMN id SET DEFAULT nextval('core.templates_modules_id_seq'::regclass);


--
-- Name: triggered_branching_actions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions ALTER COLUMN id SET DEFAULT nextval('core.triggered_branching_actions_id_seq'::regclass);


--
-- Name: triggered_branching_paths id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths ALTER COLUMN id SET DEFAULT nextval('core.triggered_branching_paths_id_seq'::regclass);


--
-- Name: triggered_dynamic_modules id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules ALTER COLUMN id SET DEFAULT nextval('core.triggered_dynamic_modules_id_seq'::regclass);


--
-- Name: triggered_launch_ctas id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas ALTER COLUMN id SET DEFAULT nextval('core.triggered_launch_ctas_id_seq'::regclass);


--
-- Name: user_auths id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_auths ALTER COLUMN id SET DEFAULT nextval('core.user_auths_id_seq'::regclass);


--
-- Name: user_deny_list id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_deny_list ALTER COLUMN id SET DEFAULT nextval('core.user_deny_list_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users ALTER COLUMN id SET DEFAULT nextval('core.users_id_seq'::regclass);


--
-- Name: users_organizations id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users_organizations ALTER COLUMN id SET DEFAULT nextval('core.users_organizations_id_seq'::regclass);


--
-- Name: visual_builder_sessions id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.visual_builder_sessions ALTER COLUMN id SET DEFAULT nextval('core.visual_builder_sessions_id_seq'::regclass);


--
-- Name: webhooks id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.webhooks ALTER COLUMN id SET DEFAULT nextval('core.webhooks_id_seq'::regclass);


--
-- Name: launch_reports id; Type: DEFAULT; Schema: debug; Owner: -
--

ALTER TABLE ONLY debug.launch_reports ALTER COLUMN id SET DEFAULT nextval('debug.launch_reports_id_seq'::regclass);


--
-- Name: report_dumps id; Type: DEFAULT; Schema: debug; Owner: -
--

ALTER TABLE ONLY debug.report_dumps ALTER COLUMN id SET DEFAULT nextval('debug.report_dumps_id_seq'::regclass);


--
-- Name: account_user_daily_log account_user_daily_log_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_daily_log
    ADD CONSTRAINT account_user_daily_log_pkey PRIMARY KEY (id);


--
-- Name: account_user_data account_user_data_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_data
    ADD CONSTRAINT account_user_data_entity_id_key UNIQUE (entity_id);


--
-- Name: account_user_data account_user_data_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_data
    ADD CONSTRAINT account_user_data_pkey PRIMARY KEY (id);


--
-- Name: account_user_events account_user_events_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_events
    ADD CONSTRAINT account_user_events_pkey PRIMARY KEY (id);


--
-- Name: announcement_daily_activity announcement_daily_activity_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.announcement_daily_activity
    ADD CONSTRAINT announcement_daily_activity_pkey PRIMARY KEY (id);


--
-- Name: captured_guide_analytics captured_guide_analytics_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.captured_guide_analytics
    ADD CONSTRAINT captured_guide_analytics_entity_id_key UNIQUE (entity_id);


--
-- Name: captured_guide_analytics captured_guide_analytics_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.captured_guide_analytics
    ADD CONSTRAINT captured_guide_analytics_pkey PRIMARY KEY (id);


--
-- Name: data_usage data_usage_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.data_usage
    ADD CONSTRAINT data_usage_entity_id_key UNIQUE (entity_id);


--
-- Name: data_usage data_usage_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.data_usage
    ADD CONSTRAINT data_usage_pkey PRIMARY KEY (id);


--
-- Name: diagnostics_events diagnostics_events_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.diagnostics_events
    ADD CONSTRAINT diagnostics_events_entity_id_key UNIQUE (entity_id);


--
-- Name: diagnostics_events diagnostics_events_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.diagnostics_events
    ADD CONSTRAINT diagnostics_events_pkey PRIMARY KEY (id);


--
-- Name: events events_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.events
    ADD CONSTRAINT events_entity_id_key UNIQUE (entity_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: feature_events feature_events_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.feature_events
    ADD CONSTRAINT feature_events_pkey PRIMARY KEY (id);


--
-- Name: guide_daily_rollup guide_daily_rollup_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_daily_rollup
    ADD CONSTRAINT guide_daily_rollup_pkey PRIMARY KEY (id);


--
-- Name: guide_data guide_data_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_data
    ADD CONSTRAINT guide_data_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_data guide_data_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_data
    ADD CONSTRAINT guide_data_pkey PRIMARY KEY (id);


--
-- Name: guide_events guide_events_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_events
    ADD CONSTRAINT guide_events_pkey PRIMARY KEY (id);


--
-- Name: organization_data organization_data_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.organization_data
    ADD CONSTRAINT organization_data_entity_id_key UNIQUE (entity_id);


--
-- Name: organization_data organization_data_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.organization_data
    ADD CONSTRAINT organization_data_pkey PRIMARY KEY (id);


--
-- Name: rollup_states rollup_states_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.rollup_states
    ADD CONSTRAINT rollup_states_entity_id_key UNIQUE (entity_id);


--
-- Name: rollup_states rollup_states_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.rollup_states
    ADD CONSTRAINT rollup_states_pkey PRIMARY KEY (id);


--
-- Name: rollup_states rollup_states_rollup_name_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.rollup_states
    ADD CONSTRAINT rollup_states_rollup_name_key UNIQUE (rollup_name);


--
-- Name: step_daily_rollup step_daily_rollup_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_daily_rollup
    ADD CONSTRAINT step_daily_rollup_pkey PRIMARY KEY (id);


--
-- Name: step_data step_data_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_data
    ADD CONSTRAINT step_data_entity_id_key UNIQUE (entity_id);


--
-- Name: step_data step_data_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_data
    ADD CONSTRAINT step_data_pkey PRIMARY KEY (id);


--
-- Name: step_events step_events_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_events
    ADD CONSTRAINT step_events_pkey PRIMARY KEY (id);


--
-- Name: template_data template_data_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.template_data
    ADD CONSTRAINT template_data_entity_id_key UNIQUE (entity_id);


--
-- Name: template_data template_data_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.template_data
    ADD CONSTRAINT template_data_pkey PRIMARY KEY (id);


--
-- Name: template_data template_data_template_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.template_data
    ADD CONSTRAINT template_data_template_id_key UNIQUE (template_id);


--
-- Name: value_data_aggregate value_data_aggregate_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data_aggregate
    ADD CONSTRAINT value_data_aggregate_entity_id_key UNIQUE (entity_id);


--
-- Name: value_data_aggregate value_data_aggregate_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data_aggregate
    ADD CONSTRAINT value_data_aggregate_pkey PRIMARY KEY (id);


--
-- Name: value_data value_data_entity_id_key; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data
    ADD CONSTRAINT value_data_entity_id_key UNIQUE (entity_id);


--
-- Name: value_data value_data_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data
    ADD CONSTRAINT value_data_pkey PRIMARY KEY (id);


--
-- Name: account_audit account_audit_entity_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.account_audit
    ADD CONSTRAINT account_audit_entity_id_key UNIQUE (entity_id);


--
-- Name: account_audit account_audit_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.account_audit
    ADD CONSTRAINT account_audit_pkey PRIMARY KEY (id);


--
-- Name: auth_audit auth_audit_entity_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.auth_audit
    ADD CONSTRAINT auth_audit_entity_id_key UNIQUE (entity_id);


--
-- Name: auth_audit auth_audit_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.auth_audit
    ADD CONSTRAINT auth_audit_pkey PRIMARY KEY (id);


--
-- Name: deleted_users deleted_users_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.deleted_users
    ADD CONSTRAINT deleted_users_pkey PRIMARY KEY (id);


--
-- Name: deleted_users deleted_users_user_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.deleted_users
    ADD CONSTRAINT deleted_users_user_id_key UNIQUE (user_id);


--
-- Name: guide_base_audit guide_base_audit_entity_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.guide_base_audit
    ADD CONSTRAINT guide_base_audit_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_base_audit guide_base_audit_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.guide_base_audit
    ADD CONSTRAINT guide_base_audit_pkey PRIMARY KEY (id);


--
-- Name: logged_actions logged_actions_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.logged_actions
    ADD CONSTRAINT logged_actions_pkey PRIMARY KEY (event_id);


--
-- Name: module_audit module_audit_entity_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.module_audit
    ADD CONSTRAINT module_audit_entity_id_key UNIQUE (entity_id);


--
-- Name: module_audit module_audit_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.module_audit
    ADD CONSTRAINT module_audit_pkey PRIMARY KEY (id);


--
-- Name: step_prototype_audit step_prototype_audit_entity_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.step_prototype_audit
    ADD CONSTRAINT step_prototype_audit_entity_id_key UNIQUE (entity_id);


--
-- Name: step_prototype_audit step_prototype_audit_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.step_prototype_audit
    ADD CONSTRAINT step_prototype_audit_pkey PRIMARY KEY (id);


--
-- Name: template_audit template_audit_entity_id_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.template_audit
    ADD CONSTRAINT template_audit_entity_id_key UNIQUE (entity_id);


--
-- Name: template_audit template_audit_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.template_audit
    ADD CONSTRAINT template_audit_pkey PRIMARY KEY (id);


--
-- Name: account_audit_logs account_audit_logs_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_audit_logs
    ADD CONSTRAINT account_audit_logs_entity_id_key UNIQUE (entity_id);


--
-- Name: account_audit_logs account_audit_logs_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_audit_logs
    ADD CONSTRAINT account_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: account_custom_api_events account_custom_api_events_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_custom_api_events
    ADD CONSTRAINT account_custom_api_events_entity_id_key UNIQUE (entity_id);


--
-- Name: account_custom_api_events account_custom_api_events_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_custom_api_events
    ADD CONSTRAINT account_custom_api_events_pkey PRIMARY KEY (id);


--
-- Name: account_roles account_roles_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_roles
    ADD CONSTRAINT account_roles_entity_id_key UNIQUE (entity_id);


--
-- Name: account_roles account_roles_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_roles
    ADD CONSTRAINT account_roles_pkey PRIMARY KEY (id);


--
-- Name: account_user_custom_api_events account_user_custom_api_events_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_user_custom_api_events
    ADD CONSTRAINT account_user_custom_api_events_entity_id_key UNIQUE (entity_id);


--
-- Name: account_user_custom_api_events account_user_custom_api_events_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_user_custom_api_events
    ADD CONSTRAINT account_user_custom_api_events_pkey PRIMARY KEY (id);


--
-- Name: account_users account_users_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_users
    ADD CONSTRAINT account_users_entity_id_key UNIQUE (entity_id);


--
-- Name: account_users account_users_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_users
    ADD CONSTRAINT account_users_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.accounts
    ADD CONSTRAINT accounts_entity_id_key UNIQUE (entity_id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: audiences audiences_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.audiences
    ADD CONSTRAINT audiences_entity_id_key UNIQUE (entity_id);


--
-- Name: audiences audiences_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.audiences
    ADD CONSTRAINT audiences_pkey PRIMARY KEY (id);


--
-- Name: auto_complete_interaction_guide_completions auto_complete_interaction_guide_completions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interaction_guide_completions
    ADD CONSTRAINT auto_complete_interaction_guide_completions_pkey PRIMARY KEY (id);


--
-- Name: auto_complete_interactions auto_complete_interactions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interactions
    ADD CONSTRAINT auto_complete_interactions_pkey PRIMARY KEY (id);


--
-- Name: auto_launch_delete_log auto_launch_delete_log_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_delete_log
    ADD CONSTRAINT auto_launch_delete_log_entity_id_key UNIQUE (entity_id);


--
-- Name: auto_launch_delete_log auto_launch_delete_log_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_delete_log
    ADD CONSTRAINT auto_launch_delete_log_pkey PRIMARY KEY (id);


--
-- Name: auto_launch_log auto_launch_log_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log
    ADD CONSTRAINT auto_launch_log_entity_id_key UNIQUE (entity_id);


--
-- Name: auto_launch_log auto_launch_log_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log
    ADD CONSTRAINT auto_launch_log_pkey PRIMARY KEY (id);


--
-- Name: batched_notifications batched_notifications_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.batched_notifications
    ADD CONSTRAINT batched_notifications_entity_id_key UNIQUE (entity_id);


--
-- Name: batched_notifications batched_notifications_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.batched_notifications
    ADD CONSTRAINT batched_notifications_pkey PRIMARY KEY (id);


--
-- Name: branching_action_triggers branching_action_triggers_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_entity_id_key UNIQUE (entity_id);


--
-- Name: branching_action_triggers branching_action_triggers_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_pkey PRIMARY KEY (id);


--
-- Name: branching_actions branching_actions_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_actions
    ADD CONSTRAINT branching_actions_entity_id_key UNIQUE (entity_id);


--
-- Name: branching_actions branching_actions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_actions
    ADD CONSTRAINT branching_actions_pkey PRIMARY KEY (id);


--
-- Name: branching_paths branching_paths_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_paths
    ADD CONSTRAINT branching_paths_entity_id_key UNIQUE (entity_id);


--
-- Name: branching_paths branching_paths_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_paths
    ADD CONSTRAINT branching_paths_pkey PRIMARY KEY (id);


--
-- Name: guide_step_bases core_gsb_guide_id_created_from_step_prototype_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT core_gsb_guide_id_created_from_step_prototype_id_key UNIQUE (guide_base_id, created_from_step_prototype_id);


--
-- Name: guide_bases core_guide_bases_account_id_created_from_template_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT core_guide_bases_account_id_created_from_template_id_key UNIQUE (account_id, created_from_template_id);


--
-- Name: guide_module_bases core_guide_module_bases_guide_base_id_created_from_module_id_ke; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT core_guide_module_bases_guide_base_id_created_from_module_id_ke UNIQUE (guide_base_id, created_from_module_id);


--
-- Name: guide_modules core_guide_modules_guide_id_created_from_module_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT core_guide_modules_guide_id_created_from_module_id_key UNIQUE (guide_id, created_from_module_id);


--
-- Name: steps core_steps_guide_base_id_created_from_step_prototype_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT core_steps_guide_base_id_created_from_step_prototype_id_key UNIQUE (guide_id, created_from_step_prototype_id);


--
-- Name: templates_modules core_tenplate_modules_template_id_module_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules
    ADD CONSTRAINT core_tenplate_modules_template_id_module_id_key UNIQUE (template_id, module_id);


--
-- Name: users core_user_email_org_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT core_user_email_org_id_key UNIQUE (email, organization_id);


--
-- Name: custom_api_events custom_api_events_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_api_events
    ADD CONSTRAINT custom_api_events_entity_id_key UNIQUE (entity_id);


--
-- Name: custom_api_events custom_api_events_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_api_events
    ADD CONSTRAINT custom_api_events_pkey PRIMARY KEY (id);


--
-- Name: custom_attribute_values custom_attribute_values_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values
    ADD CONSTRAINT custom_attribute_values_entity_id_key UNIQUE (entity_id);


--
-- Name: custom_attribute_values custom_attribute_values_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values
    ADD CONSTRAINT custom_attribute_values_pkey PRIMARY KEY (id);


--
-- Name: custom_attributes custom_attributes_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attributes
    ADD CONSTRAINT custom_attributes_entity_id_key UNIQUE (entity_id);


--
-- Name: custom_attributes custom_attributes_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attributes
    ADD CONSTRAINT custom_attributes_pkey PRIMARY KEY (id);


--
-- Name: feature_flag_default_orgs feature_flag_default_orgs_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_default_orgs
    ADD CONSTRAINT feature_flag_default_orgs_entity_id_key UNIQUE (entity_id);


--
-- Name: feature_flag_default_orgs feature_flag_default_orgs_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_default_orgs
    ADD CONSTRAINT feature_flag_default_orgs_pkey PRIMARY KEY (id);


--
-- Name: feature_flag_enabled feature_flag_enabled_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_enabled
    ADD CONSTRAINT feature_flag_enabled_entity_id_key UNIQUE (entity_id);


--
-- Name: feature_flag_enabled feature_flag_enabled_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_enabled
    ADD CONSTRAINT feature_flag_enabled_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flags
    ADD CONSTRAINT feature_flags_entity_id_key UNIQUE (entity_id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: file_uploads file_uploads_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.file_uploads
    ADD CONSTRAINT file_uploads_entity_id_key UNIQUE (entity_id);


--
-- Name: file_uploads file_uploads_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.file_uploads
    ADD CONSTRAINT file_uploads_pkey PRIMARY KEY (id);


--
-- Name: global_default_templates global_default_templates_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.global_default_templates
    ADD CONSTRAINT global_default_templates_entity_id_key UNIQUE (entity_id);


--
-- Name: global_default_templates global_default_templates_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.global_default_templates
    ADD CONSTRAINT global_default_templates_pkey PRIMARY KEY (id);


--
-- Name: google_auths google_auths_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_auths
    ADD CONSTRAINT google_auths_entity_id_key UNIQUE (entity_id);


--
-- Name: google_auths google_auths_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_auths
    ADD CONSTRAINT google_auths_pkey PRIMARY KEY (id);


--
-- Name: google_drive_uploader_auths google_drive_uploader_auths_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_drive_uploader_auths
    ADD CONSTRAINT google_drive_uploader_auths_entity_id_key UNIQUE (entity_id);


--
-- Name: google_drive_uploader_auths google_drive_uploader_auths_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_drive_uploader_auths
    ADD CONSTRAINT google_drive_uploader_auths_pkey PRIMARY KEY (id);


--
-- Name: guide_base_step_auto_complete_interactions guide_base_step_auto_complete_interactions_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_auto_complete_interactions
    ADD CONSTRAINT guide_base_step_auto_complete_interactions_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_base_step_auto_complete_interactions guide_base_step_auto_complete_interactions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_auto_complete_interactions
    ADD CONSTRAINT guide_base_step_auto_complete_interactions_pkey PRIMARY KEY (id);


--
-- Name: guide_base_step_ctas guide_base_step_ctas_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas
    ADD CONSTRAINT guide_base_step_ctas_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_base_step_ctas guide_base_step_ctas_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas
    ADD CONSTRAINT guide_base_step_ctas_pkey PRIMARY KEY (id);


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements
    ADD CONSTRAINT guide_base_step_tagged_elements_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements
    ADD CONSTRAINT guide_base_step_tagged_elements_pkey PRIMARY KEY (id);


--
-- Name: guide_bases guide_bases_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT guide_bases_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_bases guide_bases_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT guide_bases_pkey PRIMARY KEY (id);


--
-- Name: guide_module_bases guide_module_bases_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT guide_module_bases_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_module_bases guide_module_bases_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT guide_module_bases_pkey PRIMARY KEY (id);


--
-- Name: guide_modules guide_modules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT guide_modules_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_modules guide_modules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT guide_modules_pkey PRIMARY KEY (id);


--
-- Name: guide_participants guide_participants_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants
    ADD CONSTRAINT guide_participants_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_participants guide_participants_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants
    ADD CONSTRAINT guide_participants_pkey PRIMARY KEY (id);


--
-- Name: guide_step_bases guide_step_bases_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT guide_step_bases_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_step_bases guide_step_bases_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT guide_step_bases_pkey PRIMARY KEY (id);


--
-- Name: guide_targets guide_targets_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_targets
    ADD CONSTRAINT guide_targets_entity_id_key UNIQUE (entity_id);


--
-- Name: guide_targets guide_targets_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_targets
    ADD CONSTRAINT guide_targets_pkey PRIMARY KEY (id);


--
-- Name: guides guides_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides
    ADD CONSTRAINT guides_entity_id_key UNIQUE (entity_id);


--
-- Name: guides guides_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides
    ADD CONSTRAINT guides_pkey PRIMARY KEY (id);


--
-- Name: input_step_answers input_step_answers_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers
    ADD CONSTRAINT input_step_answers_entity_id_key UNIQUE (entity_id);


--
-- Name: input_step_answers input_step_answers_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers
    ADD CONSTRAINT input_step_answers_pkey PRIMARY KEY (id);


--
-- Name: input_step_bases input_step_bases_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_bases
    ADD CONSTRAINT input_step_bases_entity_id_key UNIQUE (entity_id);


--
-- Name: input_step_bases input_step_bases_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_bases
    ADD CONSTRAINT input_step_bases_pkey PRIMARY KEY (id);


--
-- Name: input_step_prototypes input_step_prototypes_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_prototypes
    ADD CONSTRAINT input_step_prototypes_entity_id_key UNIQUE (entity_id);


--
-- Name: input_step_prototypes input_step_prototypes_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_prototypes
    ADD CONSTRAINT input_step_prototypes_pkey PRIMARY KEY (id);


--
-- Name: integration_api_keys integration_api_keys_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_api_keys
    ADD CONSTRAINT integration_api_keys_entity_id_key UNIQUE (entity_id);


--
-- Name: integration_api_keys integration_api_keys_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_api_keys
    ADD CONSTRAINT integration_api_keys_pkey PRIMARY KEY (id);


--
-- Name: integration_template_selections integration_template_selections_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_template_selections
    ADD CONSTRAINT integration_template_selections_entity_id_key UNIQUE (entity_id);


--
-- Name: integration_template_selections integration_template_selections_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_template_selections
    ADD CONSTRAINT integration_template_selections_pkey PRIMARY KEY (id);


--
-- Name: internal_feature_flags internal_feature_flags_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.internal_feature_flags
    ADD CONSTRAINT internal_feature_flags_entity_id_key UNIQUE (entity_id);


--
-- Name: internal_feature_flags internal_feature_flags_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.internal_feature_flags
    ADD CONSTRAINT internal_feature_flags_pkey PRIMARY KEY (id);


--
-- Name: media_references media_references_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.media_references
    ADD CONSTRAINT media_references_entity_id_key UNIQUE (entity_id);


--
-- Name: media_references media_references_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.media_references
    ADD CONSTRAINT media_references_pkey PRIMARY KEY (id);


--
-- Name: medias medias_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.medias
    ADD CONSTRAINT medias_entity_id_key UNIQUE (entity_id);


--
-- Name: medias medias_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.medias
    ADD CONSTRAINT medias_pkey PRIMARY KEY (id);


--
-- Name: module_auto_launch_rules module_auto_launch_rules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.module_auto_launch_rules
    ADD CONSTRAINT module_auto_launch_rules_entity_id_key UNIQUE (entity_id);


--
-- Name: module_auto_launch_rules module_auto_launch_rules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.module_auto_launch_rules
    ADD CONSTRAINT module_auto_launch_rules_pkey PRIMARY KEY (id);


--
-- Name: modules modules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules
    ADD CONSTRAINT modules_entity_id_key UNIQUE (entity_id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: modules_step_prototypes modules_step_prototypes_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules_step_prototypes
    ADD CONSTRAINT modules_step_prototypes_entity_id_key UNIQUE (entity_id);


--
-- Name: modules_step_prototypes modules_step_prototypes_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules_step_prototypes
    ADD CONSTRAINT modules_step_prototypes_pkey PRIMARY KEY (id);


--
-- Name: nps_participants nps_participants_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants
    ADD CONSTRAINT nps_participants_entity_id_key UNIQUE (entity_id);


--
-- Name: nps_participants nps_participants_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants
    ADD CONSTRAINT nps_participants_pkey PRIMARY KEY (id);


--
-- Name: nps_survey_instances nps_survey_instances_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_survey_instances
    ADD CONSTRAINT nps_survey_instances_entity_id_key UNIQUE (entity_id);


--
-- Name: nps_survey_instances nps_survey_instances_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_survey_instances
    ADD CONSTRAINT nps_survey_instances_pkey PRIMARY KEY (id);


--
-- Name: nps_surveys nps_surveys_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_surveys
    ADD CONSTRAINT nps_surveys_entity_id_key UNIQUE (entity_id);


--
-- Name: nps_surveys nps_surveys_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_surveys
    ADD CONSTRAINT nps_surveys_pkey PRIMARY KEY (id);


--
-- Name: organization_hosts organization_hosts_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_hosts
    ADD CONSTRAINT organization_hosts_entity_id_key UNIQUE (entity_id);


--
-- Name: organization_hosts organization_hosts_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_hosts
    ADD CONSTRAINT organization_hosts_pkey PRIMARY KEY (id);


--
-- Name: organization_inline_embeds organization_inline_embeds_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_inline_embeds
    ADD CONSTRAINT organization_inline_embeds_entity_id_key UNIQUE (entity_id);


--
-- Name: organization_inline_embeds organization_inline_embeds_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_inline_embeds
    ADD CONSTRAINT organization_inline_embeds_pkey PRIMARY KEY (id);


--
-- Name: organization_settings organization_settings_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_settings
    ADD CONSTRAINT organization_settings_entity_id_key UNIQUE (entity_id);


--
-- Name: organization_settings organization_settings_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_settings
    ADD CONSTRAINT organization_settings_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organizations
    ADD CONSTRAINT organizations_entity_id_key UNIQUE (entity_id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_slug_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organizations
    ADD CONSTRAINT organizations_slug_key UNIQUE (slug);


--
-- Name: queued_cleanups queued_cleanups_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.queued_cleanups
    ADD CONSTRAINT queued_cleanups_entity_id_key UNIQUE (entity_id);


--
-- Name: queued_cleanups queued_cleanups_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.queued_cleanups
    ADD CONSTRAINT queued_cleanups_pkey PRIMARY KEY (id);


--
-- Name: segment_api_keys segment_api_keys_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_api_keys
    ADD CONSTRAINT segment_api_keys_entity_id_key UNIQUE (entity_id);


--
-- Name: segment_api_keys segment_api_keys_key_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_api_keys
    ADD CONSTRAINT segment_api_keys_key_key UNIQUE (key);


--
-- Name: segment_api_keys segment_api_keys_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_api_keys
    ADD CONSTRAINT segment_api_keys_pkey PRIMARY KEY (id);


--
-- Name: segment_examples segment_examples_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_examples
    ADD CONSTRAINT segment_examples_entity_id_key UNIQUE (entity_id);


--
-- Name: segment_examples segment_examples_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_examples
    ADD CONSTRAINT segment_examples_pkey PRIMARY KEY (id);


--
-- Name: slack_auths slack_auths_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.slack_auths
    ADD CONSTRAINT slack_auths_entity_id_key UNIQUE (entity_id);


--
-- Name: slack_auths slack_auths_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.slack_auths
    ADD CONSTRAINT slack_auths_pkey PRIMARY KEY (id);


--
-- Name: step_auto_complete_interactions step_auto_complete_interactions_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_auto_complete_interactions
    ADD CONSTRAINT step_auto_complete_interactions_entity_id_key UNIQUE (entity_id);


--
-- Name: step_auto_complete_interactions step_auto_complete_interactions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_auto_complete_interactions
    ADD CONSTRAINT step_auto_complete_interactions_pkey PRIMARY KEY (id);


--
-- Name: step_event_mapping_rules step_event_mapping_rules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mapping_rules
    ADD CONSTRAINT step_event_mapping_rules_entity_id_key UNIQUE (entity_id);


--
-- Name: step_event_mapping_rules step_event_mapping_rules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mapping_rules
    ADD CONSTRAINT step_event_mapping_rules_pkey PRIMARY KEY (id);


--
-- Name: step_event_mappings step_event_mappings_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mappings
    ADD CONSTRAINT step_event_mappings_entity_id_key UNIQUE (entity_id);


--
-- Name: step_event_mappings step_event_mappings_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mappings
    ADD CONSTRAINT step_event_mappings_pkey PRIMARY KEY (id);


--
-- Name: step_participants step_participants_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_participants
    ADD CONSTRAINT step_participants_entity_id_key UNIQUE (entity_id);


--
-- Name: step_participants step_participants_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_participants
    ADD CONSTRAINT step_participants_pkey PRIMARY KEY (id);


--
-- Name: step_prototype_auto_complete_interactions step_prototype_auto_complete_interactions_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_auto_complete_interactions
    ADD CONSTRAINT step_prototype_auto_complete_interactions_entity_id_key UNIQUE (entity_id);


--
-- Name: step_prototype_auto_complete_interactions step_prototype_auto_complete_interactions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_auto_complete_interactions
    ADD CONSTRAINT step_prototype_auto_complete_interactions_pkey PRIMARY KEY (id);


--
-- Name: step_prototype_ctas step_prototype_ctas_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_ctas
    ADD CONSTRAINT step_prototype_ctas_entity_id_key UNIQUE (entity_id);


--
-- Name: step_prototype_ctas step_prototype_ctas_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_ctas
    ADD CONSTRAINT step_prototype_ctas_pkey PRIMARY KEY (id);


--
-- Name: step_prototype_tagged_elements step_prototype_tagged_elements_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_tagged_elements
    ADD CONSTRAINT step_prototype_tagged_elements_entity_id_key UNIQUE (entity_id);


--
-- Name: step_prototype_tagged_elements step_prototype_tagged_elements_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_tagged_elements
    ADD CONSTRAINT step_prototype_tagged_elements_pkey PRIMARY KEY (id);


--
-- Name: step_prototypes step_prototypes_context_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes
    ADD CONSTRAINT step_prototypes_context_id_key UNIQUE (context_id);


--
-- Name: step_prototypes step_prototypes_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes
    ADD CONSTRAINT step_prototypes_entity_id_key UNIQUE (entity_id);


--
-- Name: step_prototypes step_prototypes_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes
    ADD CONSTRAINT step_prototypes_pkey PRIMARY KEY (id);


--
-- Name: step_tagged_element_participants step_tagged_element_participants_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_element_participants
    ADD CONSTRAINT step_tagged_element_participants_entity_id_key UNIQUE (entity_id);


--
-- Name: step_tagged_element_participants step_tagged_element_participants_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_element_participants
    ADD CONSTRAINT step_tagged_element_participants_pkey PRIMARY KEY (id);


--
-- Name: step_tagged_elements step_tagged_elements_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_entity_id_key UNIQUE (entity_id);


--
-- Name: step_tagged_elements step_tagged_elements_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_pkey PRIMARY KEY (id);


--
-- Name: steps steps_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_entity_id_key UNIQUE (entity_id);


--
-- Name: steps steps_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_pkey PRIMARY KEY (id);


--
-- Name: template_audiences template_audiences_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_audiences
    ADD CONSTRAINT template_audiences_entity_id_key UNIQUE (entity_id);


--
-- Name: template_audiences template_audiences_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_audiences
    ADD CONSTRAINT template_audiences_pkey PRIMARY KEY (id);


--
-- Name: template_auto_launch_rules template_auto_launch_rules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_auto_launch_rules
    ADD CONSTRAINT template_auto_launch_rules_entity_id_key UNIQUE (entity_id);


--
-- Name: template_auto_launch_rules template_auto_launch_rules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_auto_launch_rules
    ADD CONSTRAINT template_auto_launch_rules_pkey PRIMARY KEY (id);


--
-- Name: template_split_targets template_split_targets_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_split_targets
    ADD CONSTRAINT template_split_targets_entity_id_key UNIQUE (entity_id);


--
-- Name: template_split_targets template_split_targets_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_split_targets
    ADD CONSTRAINT template_split_targets_pkey PRIMARY KEY (id);


--
-- Name: template_targets template_targets_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_targets
    ADD CONSTRAINT template_targets_entity_id_key UNIQUE (entity_id);


--
-- Name: template_targets template_targets_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_targets
    ADD CONSTRAINT template_targets_pkey PRIMARY KEY (id);


--
-- Name: templates templates_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates
    ADD CONSTRAINT templates_entity_id_key UNIQUE (entity_id);


--
-- Name: templates_modules templates_modules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules
    ADD CONSTRAINT templates_modules_entity_id_key UNIQUE (entity_id);


--
-- Name: templates_modules templates_modules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules
    ADD CONSTRAINT templates_modules_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: triggered_branching_actions triggered_branching_actions_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_entity_id_key UNIQUE (entity_id);


--
-- Name: triggered_branching_actions triggered_branching_actions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_pkey PRIMARY KEY (id);


--
-- Name: triggered_branching_paths triggered_branching_paths_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_entity_id_key UNIQUE (entity_id);


--
-- Name: triggered_branching_paths triggered_branching_paths_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_pkey PRIMARY KEY (id);


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules
    ADD CONSTRAINT triggered_dynamic_modules_entity_id_key UNIQUE (entity_id);


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules
    ADD CONSTRAINT triggered_dynamic_modules_pkey PRIMARY KEY (id);


--
-- Name: triggered_launch_ctas triggered_launch_ctas_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_entity_id_key UNIQUE (entity_id);


--
-- Name: triggered_launch_ctas triggered_launch_ctas_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_pkey PRIMARY KEY (id);


--
-- Name: user_auths user_auths_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_auths
    ADD CONSTRAINT user_auths_entity_id_key UNIQUE (entity_id);


--
-- Name: user_auths user_auths_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_auths
    ADD CONSTRAINT user_auths_pkey PRIMARY KEY (id);


--
-- Name: user_auths user_auths_user_id_type_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_auths
    ADD CONSTRAINT user_auths_user_id_type_key UNIQUE (user_id, type);


--
-- Name: user_deny_list user_deny_list_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_deny_list
    ADD CONSTRAINT user_deny_list_entity_id_key UNIQUE (entity_id);


--
-- Name: user_deny_list user_deny_list_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_deny_list
    ADD CONSTRAINT user_deny_list_pkey PRIMARY KEY (id);


--
-- Name: user_deny_list user_deny_list_text_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_deny_list
    ADD CONSTRAINT user_deny_list_text_key UNIQUE (text);


--
-- Name: users users_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_entity_id_key UNIQUE (entity_id);


--
-- Name: users_organizations users_organizations_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users_organizations
    ADD CONSTRAINT users_organizations_entity_id_key UNIQUE (entity_id);


--
-- Name: users_organizations users_organizations_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users_organizations
    ADD CONSTRAINT users_organizations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visual_builder_sessions visual_builder_sessions_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.visual_builder_sessions
    ADD CONSTRAINT visual_builder_sessions_entity_id_key UNIQUE (entity_id);


--
-- Name: visual_builder_sessions visual_builder_sessions_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.visual_builder_sessions
    ADD CONSTRAINT visual_builder_sessions_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_entity_id_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.webhooks
    ADD CONSTRAINT webhooks_entity_id_key UNIQUE (entity_id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: launch_reports launch_reports_entity_id_key; Type: CONSTRAINT; Schema: debug; Owner: -
--

ALTER TABLE ONLY debug.launch_reports
    ADD CONSTRAINT launch_reports_entity_id_key UNIQUE (entity_id);


--
-- Name: launch_reports launch_reports_pkey; Type: CONSTRAINT; Schema: debug; Owner: -
--

ALTER TABLE ONLY debug.launch_reports
    ADD CONSTRAINT launch_reports_pkey PRIMARY KEY (id);


--
-- Name: report_dumps report_dumps_entity_id_key; Type: CONSTRAINT; Schema: debug; Owner: -
--

ALTER TABLE ONLY debug.report_dumps
    ADD CONSTRAINT report_dumps_entity_id_key UNIQUE (entity_id);


--
-- Name: report_dumps report_dumps_pkey; Type: CONSTRAINT; Schema: debug; Owner: -
--

ALTER TABLE ONLY debug.report_dumps
    ADD CONSTRAINT report_dumps_pkey PRIMARY KEY (id);


--
-- Name: account_user_daily_log_ix; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX account_user_daily_log_ix ON analytics.account_user_daily_log USING btree (organization_id, date, account_user_id);


--
-- Name: account_user_data_unique; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX account_user_data_unique ON analytics.account_user_data USING btree (organization_id, account_user_id);


--
-- Name: analytics_account_user_data_account_user_id; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_account_user_data_account_user_id ON analytics.account_user_data USING btree (account_user_id);


--
-- Name: analytics_account_user_data_organization_id; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_account_user_data_organization_id ON analytics.account_user_data USING btree (organization_id);


--
-- Name: analytics_account_user_events_created_at_brin_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_account_user_events_created_at_brin_idx ON analytics.account_user_events USING brin (created_at);


--
-- Name: analytics_data_usage_name; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_data_usage_name ON analytics.data_usage USING btree (name);


--
-- Name: analytics_events_created_at_brin_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_events_created_at_brin_idx ON analytics.events USING brin (created_at);


--
-- Name: analytics_guide_events_created_at_brin_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_guide_events_created_at_brin_idx ON analytics.guide_events USING brin (created_at);


--
-- Name: analytics_step_events_created_at_brin_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX analytics_step_events_created_at_brin_idx ON analytics.step_events USING brin (created_at);


--
-- Name: announcement_daily_activity_ix; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX announcement_daily_activity_ix ON analytics.announcement_daily_activity USING btree (organization_id, date, template_id);


--
-- Name: data_usage_unique; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX data_usage_unique ON analytics.data_usage USING btree (organization_id, name, type, scope);


--
-- Name: diagnostics_events_event_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX diagnostics_events_event_idx ON analytics.diagnostics_events USING btree (event);


--
-- Name: diagnostics_events_org_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX diagnostics_events_org_idx ON analytics.diagnostics_events USING btree (organization_id);


--
-- Name: feature_events_created_at_brin_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX feature_events_created_at_brin_idx ON analytics.feature_events USING brin (created_at);


--
-- Name: guide_daily_rollup_ix; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX guide_daily_rollup_ix ON analytics.guide_daily_rollup USING btree (organization_id, date, template_id, account_user_id);


--
-- Name: guide_data_guide_base_id_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX guide_data_guide_base_id_idx ON analytics.guide_data USING btree (guide_base_id);


--
-- Name: guide_data_unique; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX guide_data_unique ON analytics.guide_data USING btree (organization_id, guide_base_id);


--
-- Name: organization_data_unique; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX organization_data_unique ON analytics.organization_data USING btree (organization_id);


--
-- Name: step_analytics_account_user_id; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_analytics_account_user_id ON analytics.step_events USING btree (account_user_entity_id);


--
-- Name: step_analytics_step_id; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_analytics_step_id ON analytics.step_events USING btree (step_entity_id);


--
-- Name: step_daily_rollup_account_user_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_daily_rollup_account_user_idx ON analytics.step_daily_rollup USING btree (account_user_id);


--
-- Name: step_daily_rollup_date_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_daily_rollup_date_idx ON analytics.step_daily_rollup USING btree (date);


--
-- Name: step_daily_rollup_ix; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX step_daily_rollup_ix ON analytics.step_daily_rollup USING btree (organization_id, date, step_prototype_id, account_user_id);


--
-- Name: step_daily_rollup_org_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_daily_rollup_org_idx ON analytics.step_daily_rollup USING btree (organization_id);


--
-- Name: step_daily_rollup_step_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_daily_rollup_step_idx ON analytics.step_daily_rollup USING btree (step_id);


--
-- Name: step_daily_rollup_step_proto_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_daily_rollup_step_proto_idx ON analytics.step_daily_rollup USING btree (step_prototype_id);


--
-- Name: step_data_step_prototype_id_idx; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX step_data_step_prototype_id_idx ON analytics.step_data USING btree (step_prototype_id);


--
-- Name: step_data_unique; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX step_data_unique ON analytics.step_data USING btree (step_prototype_id, organization_id, template_id);


--
-- Name: value_data_unique; Type: INDEX; Schema: analytics; Owner: -
--

CREATE UNIQUE INDEX value_data_unique ON analytics.value_data USING btree (organization_id);


--
-- Name: account_audit_account_id; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX account_audit_account_id ON audit.account_audit USING btree (account_id);


--
-- Name: account_audit_event_name_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX account_audit_event_name_idx ON audit.account_audit USING btree (event_name);


--
-- Name: guide_base_audit_guide_base_id; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX guide_base_audit_guide_base_id ON audit.guide_base_audit USING btree (guide_base_id);


--
-- Name: logged_actions_action_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX logged_actions_action_idx ON audit.logged_actions USING btree (action);


--
-- Name: logged_actions_action_tstamp_tx_stm_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX logged_actions_action_tstamp_tx_stm_idx ON audit.logged_actions USING btree (action_tstamp_stm);


--
-- Name: logged_actions_relid_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX logged_actions_relid_idx ON audit.logged_actions USING btree (relid);


--
-- Name: module_audit_module_id; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX module_audit_module_id ON audit.module_audit USING btree (module_id);


--
-- Name: step_prototype_audit_step_prototype_id; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX step_prototype_audit_step_prototype_id ON audit.step_prototype_audit USING btree (step_prototype_id);


--
-- Name: template_audit_event_name_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX template_audit_event_name_idx ON audit.template_audit USING btree (event_name);


--
-- Name: template_audit_latest_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX template_audit_latest_idx ON audit.template_audit USING btree (template_id, created_at DESC);


--
-- Name: template_audit_organization_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX template_audit_organization_id_idx ON audit.template_audit USING btree (organization_id);


--
-- Name: template_audit_template_id; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX template_audit_template_id ON audit.template_audit USING btree (template_id);


--
-- Name: account_custom_api_events__event__unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX account_custom_api_events__event__unique ON core.account_custom_api_events USING btree (account_entity_id, event_name);


--
-- Name: account_last_active_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_last_active_at_idx ON core.accounts USING btree (last_active_at);


--
-- Name: account_user_custom_api_events__event__unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX account_user_custom_api_events__event__unique ON core.account_user_custom_api_events USING btree (account_user_entity_id, event_name);


--
-- Name: account_users_email_match_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_users_email_match_idx ON core.account_users USING btree (email);


--
-- Name: account_users_email_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_users_email_search_idx ON core.account_users USING gin (email public.gin_trgm_ops);


--
-- Name: account_users_external_id_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_users_external_id_search_idx ON core.account_users USING gin (external_id public.gin_trgm_ops);


--
-- Name: account_users_full_name_match_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_users_full_name_match_idx ON core.account_users USING btree (full_name);


--
-- Name: account_users_full_name_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_users_full_name_search_idx ON core.account_users USING gin (full_name public.gin_trgm_ops);


--
-- Name: account_users_updated_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX account_users_updated_at_idx ON core.account_users USING btree (updated_at);


--
-- Name: accounts_blocked_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_blocked_at_idx ON core.accounts USING btree (blocked_at);


--
-- Name: accounts_created_in_organization_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_created_in_organization_at_idx ON core.accounts USING btree (created_in_organization_at);


--
-- Name: accounts_deleted_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_deleted_at_idx ON core.accounts USING btree (deleted_at);


--
-- Name: accounts_external_id_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_external_id_search_idx ON core.accounts USING gin (external_id public.gin_trgm_ops);


--
-- Name: accounts_name_match_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_name_match_idx ON core.accounts USING btree (name);


--
-- Name: accounts_name_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_name_search_idx ON core.accounts USING gin (name public.gin_trgm_ops);


--
-- Name: accounts_updated_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX accounts_updated_at_idx ON core.accounts USING btree (updated_at);


--
-- Name: auto_complete_interactions_association_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX auto_complete_interactions_association_idx ON core.auto_complete_interactions USING btree (organization_id, completable_type, completable_id);


--
-- Name: auto_complete_interactions_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX auto_complete_interactions_search_idx ON core.auto_complete_interactions USING btree (organization_id, interaction_type, completable_type, completable_id);


--
-- Name: auto_launch_log_account_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX auto_launch_log_account_id ON core.auto_launch_log USING btree (account_id);


--
-- Name: auto_launch_log_created_guide_base_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX auto_launch_log_created_guide_base_id_idx ON core.auto_launch_log USING btree (created_guide_base_id);


--
-- Name: auto_launch_log_template_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX auto_launch_log_template_id ON core.auto_launch_log USING btree (template_id);


--
-- Name: branching_action_triggers_upon_completion_origin_slate_node_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX branching_action_triggers_upon_completion_origin_slate_node_id ON core.branching_action_triggers USING btree (upon_completion_of_origin_slate_node_id);


--
-- Name: branching_paths_branching_key; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX branching_paths_branching_key ON core.branching_paths USING btree (branching_key);


--
-- Name: branching_paths_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX branching_paths_organization_id ON core.branching_paths USING btree (organization_id);


--
-- Name: branching_paths_template_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX branching_paths_template_id_idx ON core.branching_paths USING btree (template_id);


--
-- Name: core_account_audit_logs_account_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_audit_logs_account_id_fkey ON core.account_audit_logs USING btree (account_id);


--
-- Name: core_account_audit_logs_account_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_audit_logs_account_user_id_fkey ON core.account_audit_logs USING btree (account_user_id);


--
-- Name: core_account_audit_logs_org_id_change_event; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_audit_logs_org_id_change_event ON core.account_audit_logs USING gin (organization_id, account_id, change_event);


--
-- Name: core_account_audit_logs_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_audit_logs_organization_id_fkey ON core.account_audit_logs USING btree (organization_id);


--
-- Name: core_account_roles_account_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_roles_account_id_fkey ON core.account_roles USING btree (account_id);


--
-- Name: core_account_roles_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_roles_org_id_fkey ON core.account_roles USING btree (organization_id);


--
-- Name: core_account_users_account_id_external_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_users_account_id_external_id ON core.account_users USING btree (account_id, external_id);


--
-- Name: core_account_users_external_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_users_external_id ON core.account_users USING btree (external_id);


--
-- Name: core_account_users_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_account_users_org_id_fkey ON core.account_users USING btree (organization_id);


--
-- Name: core_accounts_external_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_accounts_external_id_fkey ON core.accounts USING btree (external_id);


--
-- Name: core_accounts_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_accounts_organization_id_fkey ON core.accounts USING btree (organization_id);


--
-- Name: core_accounts_primary_org_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_accounts_primary_org_user_id_fkey ON core.accounts USING btree (primary_organization_user_id);


--
-- Name: core_accts_org_id_external_id; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_accts_org_id_external_id ON core.accounts USING btree (organization_id, external_id);


--
-- Name: core_accts_users_org_id_acct_id_ext_id; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_accts_users_org_id_acct_id_ext_id ON core.account_users USING btree (organization_id, account_id, external_id);


--
-- Name: core_bat_upco_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_bat_upco_module_id_fkey ON core.branching_action_triggers USING btree (upon_completion_of_module_id);


--
-- Name: core_bat_upco_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_bat_upco_step_prototype_id_fkey ON core.branching_action_triggers USING btree (upon_completion_of_step_prototype_id);


--
-- Name: core_bat_upon_completion_of_template_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_bat_upon_completion_of_template_id_fkey ON core.branching_action_triggers USING btree (upon_completion_of_template_id);


--
-- Name: core_branching_action_triggers_branching_action_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_branching_action_triggers_branching_action_id_fkey ON core.branching_action_triggers USING btree (branching_action_id);


--
-- Name: core_branching_action_triggers_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_branching_action_triggers_org_id_fkey ON core.branching_action_triggers USING btree (organization_id);


--
-- Name: core_branching_actions_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_branching_actions_module_id_fkey ON core.branching_actions USING btree (module_id);


--
-- Name: core_branching_actions_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_branching_actions_organization_id_fkey ON core.branching_actions USING btree (organization_id);


--
-- Name: core_branching_actions_template_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_branching_actions_template_id_fkey ON core.branching_actions USING btree (template_id);


--
-- Name: core_cust_attr_vals_acct_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_cust_attr_vals_acct_id_fkey ON core.custom_attribute_values USING btree (account_id);


--
-- Name: core_cust_attr_vals_acct_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_cust_attr_vals_acct_user_id_fkey ON core.custom_attribute_values USING btree (account_user_id);


--
-- Name: core_cust_attr_vals_cust_attr_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_cust_attr_vals_cust_attr_id_fkey ON core.custom_attribute_values USING btree (custom_attribute_id);


--
-- Name: core_cust_attr_vals_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_cust_attr_vals_org_id_fkey ON core.custom_attribute_values USING btree (organization_id);


--
-- Name: core_custom_attributes_org_id_name_type_unique_compound; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_custom_attributes_org_id_name_type_unique_compound ON core.custom_attributes USING btree (organization_id, name, type);


--
-- Name: core_feature_flag_enabled_feature_flag_id_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_feature_flag_enabled_feature_flag_id_organization_id ON core.feature_flag_enabled USING btree (feature_flag_id, organization_id);


--
-- Name: core_feature_flag_enabled_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_feature_flag_enabled_organization_id ON core.feature_flag_enabled USING btree (organization_id);


--
-- Name: core_feature_flags_name; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_feature_flags_name ON core.feature_flags USING btree (name);


--
-- Name: core_file_uploads_account_user_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_file_uploads_account_user_id ON core.file_uploads USING btree (account_user_id);


--
-- Name: core_file_uploads_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_file_uploads_organization_id ON core.file_uploads USING btree (organization_id);


--
-- Name: core_file_uploads_slate_node_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_file_uploads_slate_node_id ON core.file_uploads USING btree (slate_node_id);


--
-- Name: core_file_uploads_step_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_file_uploads_step_id_fkey ON core.file_uploads USING btree (step_id);


--
-- Name: core_gdua_email; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gdua_email ON core.google_drive_uploader_auths USING btree (email);


--
-- Name: core_gdua_external_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gdua_external_id ON core.google_drive_uploader_auths USING btree (external_id);


--
-- Name: core_google_auths_external_id; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_google_auths_external_id ON core.google_auths USING btree (external_id);


--
-- Name: core_google_auths_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_google_auths_user_id_fkey ON core.google_auths USING btree (user_id);


--
-- Name: core_gp_account_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gp_account_user_id_fkey ON core.guide_participants USING btree (account_user_id);


--
-- Name: core_gp_first_viewed_at; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gp_first_viewed_at ON core.guide_participants USING btree (first_viewed_at);


--
-- Name: core_gp_guide_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gp_guide_id_fkey ON core.guide_participants USING btree (guide_id);


--
-- Name: core_gp_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gp_organization_id ON core.guide_participants USING btree (organization_id);


--
-- Name: core_gt_email_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gt_email_id_fkey ON core.guide_targets USING btree (account_user_email);


--
-- Name: core_gt_ext_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gt_ext_id_fkey ON core.guide_targets USING btree (account_user_external_id);


--
-- Name: core_gt_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_gt_org_id_fkey ON core.guide_targets USING btree (organization_id);


--
-- Name: core_guide_base_step_auto_complete_interactions_guide_base_step; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_base_step_auto_complete_interactions_guide_base_step ON core.guide_base_step_auto_complete_interactions USING btree (guide_base_step_id);


--
-- Name: core_guide_base_step_ctas_guide_base_step_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_base_step_ctas_guide_base_step_id_fkey ON core.guide_base_step_ctas USING btree (guide_base_step_id);


--
-- Name: core_guide_bases_account_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_bases_account_id_fkey ON core.guide_bases USING btree (account_id);


--
-- Name: core_guide_bases_cfst_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_bases_cfst_id_fkey ON core.guide_bases USING btree (created_from_split_test_id);


--
-- Name: core_guide_bases_cft_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_bases_cft_id_fkey ON core.guide_bases USING btree (created_from_template_id);


--
-- Name: core_guide_bases_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_bases_org_id_fkey ON core.guide_bases USING btree (organization_id);


--
-- Name: core_guide_bases_state; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_bases_state ON core.guide_bases USING btree (state);


--
-- Name: core_guide_module_bases_created_from_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_module_bases_created_from_module_id_fkey ON core.guide_module_bases USING btree (created_from_module_id);


--
-- Name: core_guide_module_bases_guide_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_module_bases_guide_base_id_fkey ON core.guide_module_bases USING btree (guide_base_id);


--
-- Name: core_guide_module_bases_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_module_bases_organization_id_fkey ON core.guide_module_bases USING btree (organization_id);


--
-- Name: core_guide_modules_created_from_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_modules_created_from_module_id_fkey ON core.guide_modules USING btree (created_from_module_id);


--
-- Name: core_guide_modules_guide_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_modules_guide_id_fkey ON core.guide_modules USING btree (guide_id);


--
-- Name: core_guide_modules_guide_module_base_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_modules_guide_module_base_id ON core.guide_modules USING btree (created_from_guide_module_base_id);


--
-- Name: core_guide_modules_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_modules_organization_id_fkey ON core.guide_modules USING btree (organization_id);


--
-- Name: core_guide_step_bases_created_from_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_step_bases_created_from_step_prototype_id_fkey ON core.guide_step_bases USING btree (created_from_step_prototype_id);


--
-- Name: core_guide_step_bases_guide_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_step_bases_guide_base_id_fkey ON core.guide_step_bases USING btree (guide_base_id);


--
-- Name: core_guide_step_bases_guide_module_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_step_bases_guide_module_base_id_fkey ON core.guide_step_bases USING btree (guide_module_base_id);


--
-- Name: core_guide_step_bases_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_step_bases_organization_id_fkey ON core.guide_step_bases USING btree (organization_id);


--
-- Name: core_guide_targets_guide_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_targets_guide_base_id_fkey ON core.guide_targets USING btree (guide_base_id);


--
-- Name: core_guide_targets_target_type; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guide_targets_target_type ON core.guide_targets USING btree (target_type);


--
-- Name: core_guides_account_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guides_account_id_fkey ON core.guides USING btree (account_id);


--
-- Name: core_guides_created_from_template_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guides_created_from_template_id_fkey ON core.guides USING btree (created_from_template_id);


--
-- Name: core_guides_guide_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guides_guide_base_id_fkey ON core.guides USING btree (created_from_guide_base_id);


--
-- Name: core_guides_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_guides_organization_id_fkey ON core.guides USING btree (organization_id);


--
-- Name: core_input_step_answers_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_answers_organization_id_fkey ON core.input_step_answers USING btree (organization_id);


--
-- Name: core_input_step_answers_step_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_answers_step_id_fkey ON core.input_step_answers USING btree (step_id);


--
-- Name: core_input_step_bases_created_from_input_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_bases_created_from_input_step_prototype_id_fkey ON core.input_step_bases USING btree (created_from_input_step_prototype_id);


--
-- Name: core_input_step_bases_guide_step_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_bases_guide_step_base_id_fkey ON core.input_step_bases USING btree (guide_step_base_id);


--
-- Name: core_input_step_bases_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_bases_organization_id_fkey ON core.input_step_bases USING btree (organization_id);


--
-- Name: core_input_step_prototypes_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_prototypes_organization_id_fkey ON core.input_step_prototypes USING btree (organization_id);


--
-- Name: core_input_step_prototypes_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_input_step_prototypes_step_prototype_id_fkey ON core.input_step_prototypes USING btree (step_prototype_id);


--
-- Name: core_internal_feature_flags_name; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_internal_feature_flags_name ON core.internal_feature_flags USING btree (name);


--
-- Name: core_modules_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_modules_organization_id_fkey ON core.modules USING btree (organization_id);


--
-- Name: core_msp_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_msp_module_id_fkey ON core.modules_step_prototypes USING btree (module_id);


--
-- Name: core_msp_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_msp_organization_id_fkey ON core.modules_step_prototypes USING btree (organization_id);


--
-- Name: core_msp_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_msp_step_prototype_id_fkey ON core.modules_step_prototypes USING btree (step_prototype_id);


--
-- Name: core_organization_inline_embeds_template_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_organization_inline_embeds_template_unique ON core.organization_inline_embeds USING btree (organization_id, COALESCE(template_id, 0));


--
-- Name: core_segment_api_keys_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_segment_api_keys_org_id_fkey ON core.segment_api_keys USING btree (organization_id);


--
-- Name: core_sem_org_id_event_name_compound; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_sem_org_id_event_name_compound ON core.step_event_mappings USING btree (organization_id, event_name);


--
-- Name: core_sem_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_sem_step_prototype_id_fkey ON core.step_event_mappings USING btree (step_prototype_id);


--
-- Name: core_semr_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_semr_organization_id_fkey ON core.step_event_mapping_rules USING btree (organization_id);


--
-- Name: core_semr_step_event_mapping_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_semr_step_event_mapping_id_fkey ON core.step_event_mapping_rules USING btree (step_event_mapping_id);


--
-- Name: core_slack_bot_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_slack_bot_id ON core.slack_auths USING btree (bot_user_id);


--
-- Name: core_sp_account_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_sp_account_user_id_fkey ON core.step_participants USING btree (account_user_id);


--
-- Name: core_sp_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_sp_organization_id ON core.step_participants USING btree (organization_id);


--
-- Name: core_sp_step_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_sp_step_id_fkey ON core.step_participants USING btree (step_id);


--
-- Name: core_step_auto_complete_interactions_step_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_step_auto_complete_interactions_step_id_fkey ON core.step_auto_complete_interactions USING btree (step_id);


--
-- Name: core_step_prototype_auto_complete_interactions_step_prototype_i; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_step_prototype_auto_complete_interactions_step_prototype_i ON core.step_prototype_auto_complete_interactions USING btree (step_prototype_id);


--
-- Name: core_step_prototype_ctas_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_step_prototype_ctas_step_prototype_id_fkey ON core.step_prototype_ctas USING btree (step_prototype_id);


--
-- Name: core_step_prototypes_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_step_prototypes_organization_id_fkey ON core.step_prototypes USING btree (organization_id);


--
-- Name: core_steps_completed_by_account_user_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_steps_completed_by_account_user_id ON core.steps USING btree (completed_by_account_user_id);


--
-- Name: core_steps_created_from_step_prototype_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_steps_created_from_step_prototype_id_fkey ON core.steps USING btree (created_from_step_prototype_id);


--
-- Name: core_steps_guide_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_steps_guide_id_fkey ON core.steps USING btree (guide_id);


--
-- Name: core_steps_guide_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_steps_guide_module_id_fkey ON core.steps USING btree (guide_module_id);


--
-- Name: core_steps_guide_step_base_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_steps_guide_step_base_id_fkey ON core.steps USING btree (created_from_guide_step_base_id);


--
-- Name: core_steps_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_steps_organization_id_fkey ON core.steps USING btree (organization_id);


--
-- Name: core_tba_account_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_account_user_id_fkey ON core.triggered_branching_actions USING btree (account_user_id);


--
-- Name: core_tba_branching_action_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_branching_action_id_fkey ON core.triggered_branching_actions USING btree (branching_action_id);


--
-- Name: core_tba_branching_action_trigger_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_branching_action_trigger_id_fkey ON core.triggered_branching_actions USING btree (branching_action_trigger_id);


--
-- Name: core_tba_created_guide_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_created_guide_id_fkey ON core.triggered_branching_actions USING btree (created_guide_id);


--
-- Name: core_tba_created_guide_module_base_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_created_guide_module_base_id ON core.triggered_branching_actions USING btree (created_guide_module_base_id);


--
-- Name: core_tba_created_guide_module_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_created_guide_module_id ON core.triggered_branching_actions USING btree (created_guide_module_id);


--
-- Name: core_tba_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_organization_id_fkey ON core.triggered_branching_actions USING btree (organization_id);


--
-- Name: core_tba_triggered_from_guide_if_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_triggered_from_guide_if_fkey ON core.triggered_branching_actions USING btree (triggered_from_guide_id);


--
-- Name: core_tba_triggered_from_guide_module_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_triggered_from_guide_module_id ON core.triggered_branching_actions USING btree (triggered_from_guide_module_id);


--
-- Name: core_tba_triggered_from_step_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tba_triggered_from_step_id ON core.triggered_branching_actions USING btree (triggered_from_step_id);


--
-- Name: core_template_auto_launch_rules_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_template_auto_launch_rules_organization_id ON core.template_auto_launch_rules USING btree (organization_id);


--
-- Name: core_template_auto_launch_rules_template_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_template_auto_launch_rules_template_id ON core.template_auto_launch_rules USING btree (template_id);


--
-- Name: core_template_targets_org_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_template_targets_org_id ON core.template_targets USING btree (organization_id);


--
-- Name: core_template_targets_template_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_template_targets_template_id ON core.template_targets USING btree (template_id);


--
-- Name: core_templates_archived_at; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_templates_archived_at ON core.templates USING btree (archived_at);


--
-- Name: core_templates_modules_module_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_templates_modules_module_id_fkey ON core.templates_modules USING btree (module_id);


--
-- Name: core_templates_modules_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_templates_modules_organization_id_fkey ON core.templates_modules USING btree (organization_id);


--
-- Name: core_templates_modules_template_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_templates_modules_template_id_fkey ON core.templates_modules USING btree (template_id);


--
-- Name: core_templates_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_templates_organization_id_fkey ON core.templates USING btree (organization_id);


--
-- Name: core_tep_account_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tep_account_user_id_fkey ON core.step_tagged_element_participants USING btree (account_user_id);


--
-- Name: core_tep_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tep_organization_id ON core.step_tagged_element_participants USING btree (organization_id);


--
-- Name: core_tep_step_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_tep_step_id_fkey ON core.step_tagged_element_participants USING btree (step_tagged_element_id);


--
-- Name: core_users_google_auth_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_users_google_auth_id_fkey ON core.users USING btree (google_auth_id);


--
-- Name: core_users_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_users_org_id_fkey ON core.users USING btree (organization_id);


--
-- Name: core_users_organizations_organization_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_users_organizations_organization_id_fkey ON core.users_organizations USING btree (organization_id);


--
-- Name: core_users_organizations_user_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_users_organizations_user_id_fkey ON core.users_organizations USING btree (user_id);


--
-- Name: custom_attr_values_match_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX custom_attr_values_match_idx ON core.custom_attribute_values USING btree (text_value);


--
-- Name: custom_attr_values_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX custom_attr_values_search_idx ON core.custom_attribute_values USING gin (text_value public.gin_trgm_ops);


--
-- Name: custom_attribute_values_unique_boolean_values_key; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX custom_attribute_values_unique_boolean_values_key ON core.custom_attribute_values USING btree (custom_attribute_id, boolean_value, organization_id);


--
-- Name: custom_attribute_values_unique_date_values_key; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX custom_attribute_values_unique_date_values_key ON core.custom_attribute_values USING btree (custom_attribute_id, date_value, organization_id);


--
-- Name: custom_attribute_values_unique_text_values_key; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX custom_attribute_values_unique_text_values_key ON core.custom_attribute_values USING btree (custom_attribute_id, text_value, organization_id);


--
-- Name: custom_events_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX custom_events_unique ON core.custom_api_events USING btree (name, organization_id);


--
-- Name: guide_base_step_auto_complete_interactions_created_from_prototy; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX guide_base_step_auto_complete_interactions_created_from_prototy ON core.guide_base_step_auto_complete_interactions USING btree (created_from_step_prototype_auto_complete_interaction_id);


--
-- Name: guide_base_step_ctas_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX guide_base_step_ctas_unique ON core.guide_base_step_ctas USING btree (guide_base_step_id, created_from_step_prototype_cta_id);


--
-- Name: guide_base_step_tagged_elements_guide_base_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX guide_base_step_tagged_elements_guide_base_id_idx ON core.guide_base_step_tagged_elements USING btree (guide_base_id);


--
-- Name: guide_base_step_tagged_elements_guide_base_step_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX guide_base_step_tagged_elements_guide_base_step_id_idx ON core.guide_base_step_tagged_elements USING btree (guide_base_step_id);


--
-- Name: guide_base_step_tagged_elements_index; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX guide_base_step_tagged_elements_index ON core.guide_base_step_tagged_elements USING btree (wildcard_url, element_selector, guide_base_step_id);


--
-- Name: guide_bases_exclude_from_user_targeting_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX guide_bases_exclude_from_user_targeting_idx ON core.guide_bases USING btree (exclude_from_user_targeting);


--
-- Name: guide_participant_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX guide_participant_unique ON core.guide_participants USING btree (guide_id, account_user_id);


--
-- Name: guides_deleted_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX guides_deleted_at_idx ON core.guides USING btree (deleted_at);


--
-- Name: index_step_tagged_elements_guide_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX index_step_tagged_elements_guide_id_idx ON core.step_tagged_elements USING btree (guide_id);


--
-- Name: integration_api_keys_org_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX integration_api_keys_org_id_fkey ON core.integration_api_keys USING btree (organization_id);


--
-- Name: media_references_index; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX media_references_index ON core.media_references USING btree (reference_id, reference_type);


--
-- Name: module_auto_launch_rules_module_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX module_auto_launch_rules_module_id ON core.module_auto_launch_rules USING btree (module_id);


--
-- Name: nps_state_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX nps_state_idx ON core.nps_surveys USING btree (state);


--
-- Name: segment_example_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX segment_example_unique ON core.segment_examples USING btree (organization_id, event_name);


--
-- Name: sp_ctas_template_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX sp_ctas_template_id_idx ON core.step_prototype_ctas USING btree (launchable_template_id);


--
-- Name: step_auto_complete_interactions_created_from_base_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX step_auto_complete_interactions_created_from_base_idx ON core.step_auto_complete_interactions USING btree (created_from_guide_base_step_auto_complete_interaction_id);


--
-- Name: step_participant_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX step_participant_unique ON core.step_participants USING btree (step_id, account_user_id);


--
-- Name: step_prototype_tagged_elements_unique_index; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX step_prototype_tagged_elements_unique_index ON core.step_prototype_tagged_elements USING btree (wildcard_url, element_selector, step_prototype_id, template_id);


--
-- Name: step_tagged_elements_created_from_base_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX step_tagged_elements_created_from_base_id_idx ON core.step_tagged_elements USING btree (created_from_base_id);


--
-- Name: step_tagged_elements_guide_base_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX step_tagged_elements_guide_base_id_idx ON core.step_tagged_elements USING btree (guide_base_id);


--
-- Name: step_tagged_elements_guide_base_step_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX step_tagged_elements_guide_base_step_id_idx ON core.step_tagged_elements USING btree (guide_base_step_id);


--
-- Name: step_tagged_elements_index; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX step_tagged_elements_index ON core.step_tagged_elements USING btree (wildcard_url, element_selector, step_id);


--
-- Name: step_tagged_elements_step_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX step_tagged_elements_step_id_idx ON core.step_tagged_elements USING btree (step_id);


--
-- Name: steps_completed_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX steps_completed_at_idx ON core.steps USING btree (completed_at);


--
-- Name: steps_created_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX steps_created_at_idx ON core.steps USING btree (created_at);


--
-- Name: steps_updated_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX steps_updated_at_idx ON core.steps USING btree (updated_at);


--
-- Name: template_audiences_audience_entity_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX template_audiences_audience_entity_id_idx ON core.template_audiences USING btree (audience_entity_id);


--
-- Name: template_auto_launch_rules_rule_type_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX template_auto_launch_rules_rule_type_idx ON core.template_auto_launch_rules USING btree (rule_type);


--
-- Name: template_split_targets_destination_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX template_split_targets_destination_id ON core.template_split_targets USING btree (destination_template_id);


--
-- Name: template_split_targets_source_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX template_split_targets_source_id ON core.template_split_targets USING btree (source_template_id);


--
-- Name: template_state_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX template_state_idx ON core.templates USING btree (state);


--
-- Name: template_targets_target_type_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX template_targets_target_type_idx ON core.template_targets USING btree (target_type);


--
-- Name: templates_audiences_template_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_audiences_template_id_idx ON core.template_audiences USING btree (template_id);


--
-- Name: templates_edited_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_edited_at_idx ON core.templates USING btree (edited_at);


--
-- Name: templates_edited_by_user_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_edited_by_user_id_idx ON core.templates USING btree (updated_by_user_id);


--
-- Name: templates_last_used_at_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_last_used_at_idx ON core.templates USING btree (last_used_at);


--
-- Name: templates_name_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_name_search_idx ON core.templates USING gin (name public.gin_trgm_ops);


--
-- Name: templates_private_name_search_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_private_name_search_idx ON core.templates USING gin (private_name public.gin_trgm_ops);


--
-- Name: templates_type_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX templates_type_idx ON core.templates USING btree (type);


--
-- Name: triggered_branching_actions_triggered_from_slate_node_id_fkey; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_branching_actions_triggered_from_slate_node_id_fkey ON core.triggered_branching_actions USING btree (triggered_from_slate_node_id);


--
-- Name: triggered_branching_paths_account_user_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_branching_paths_account_user_id_idx ON core.triggered_branching_paths USING btree (account_user_id);


--
-- Name: triggered_branching_paths_created_guide_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_branching_paths_created_guide_id_idx ON core.triggered_branching_paths USING btree (created_guide_id);


--
-- Name: triggered_branching_paths_created_guide_module_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_branching_paths_created_guide_module_id_idx ON core.triggered_branching_paths USING btree (created_guide_module_id);


--
-- Name: triggered_branching_paths_tf_guide_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_branching_paths_tf_guide_id_idx ON core.triggered_branching_paths USING btree (triggered_from_guide_id);


--
-- Name: triggered_branching_paths_tf_step_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_branching_paths_tf_step_id_idx ON core.triggered_branching_paths USING btree (triggered_from_step_id);


--
-- Name: triggered_launch_ctas_guide_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX triggered_launch_ctas_guide_id_idx ON core.triggered_launch_ctas USING btree (created_guide_id);


--
-- Name: webhooks_event_type; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX webhooks_event_type ON core.webhooks USING btree (event_type);


--
-- Name: webhooks_organization_id; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX webhooks_organization_id ON core.webhooks USING btree (organization_id);


--
-- Name: webhooks_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX webhooks_unique ON core.webhooks USING btree (organization_id, event_type);


--
-- Name: account_user_data account_user_data_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER account_user_data_modtime BEFORE UPDATE ON analytics.account_user_data FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: captured_guide_analytics captured_guide_analytics_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER captured_guide_analytics_modtime BEFORE UPDATE ON analytics.captured_guide_analytics FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: data_usage data_usage_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER data_usage_modtime BEFORE UPDATE ON analytics.data_usage FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: diagnostics_events diagnostics_events_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER diagnostics_events_modtime BEFORE UPDATE ON analytics.diagnostics_events FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_data guide_data_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER guide_data_modtime BEFORE UPDATE ON analytics.guide_data FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: organization_data organization_data_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER organization_data_modtime BEFORE UPDATE ON analytics.organization_data FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_data step_data_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER step_data_modtime BEFORE UPDATE ON analytics.step_data FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: template_data template_data_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER template_data_modtime BEFORE UPDATE ON analytics.template_data FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: events update_analytics_events_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER update_analytics_events_modtime BEFORE UPDATE ON analytics.events FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: rollup_states update_analytics_rollup_states_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER update_analytics_rollup_states_modtime BEFORE UPDATE ON analytics.rollup_states FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: value_data_aggregate value_data_aggregate_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER value_data_aggregate_modtime BEFORE UPDATE ON analytics.value_data_aggregate FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: value_data value_data_modtime; Type: TRIGGER; Schema: analytics; Owner: -
--

CREATE TRIGGER value_data_modtime BEFORE UPDATE ON analytics.value_data FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: account_audit update_account_audit_modtime; Type: TRIGGER; Schema: audit; Owner: -
--

CREATE TRIGGER update_account_audit_modtime BEFORE UPDATE ON audit.account_audit FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_base_audit update_guide_base_audit_modtime; Type: TRIGGER; Schema: audit; Owner: -
--

CREATE TRIGGER update_guide_base_audit_modtime BEFORE UPDATE ON audit.guide_base_audit FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: module_audit update_module_audit_modtime; Type: TRIGGER; Schema: audit; Owner: -
--

CREATE TRIGGER update_module_audit_modtime BEFORE UPDATE ON audit.module_audit FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_prototype_audit update_step_prototype_audit_modtime; Type: TRIGGER; Schema: audit; Owner: -
--

CREATE TRIGGER update_step_prototype_audit_modtime BEFORE UPDATE ON audit.step_prototype_audit FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: template_audit update_template_audit_modtime; Type: TRIGGER; Schema: audit; Owner: -
--

CREATE TRIGGER update_template_audit_modtime BEFORE UPDATE ON audit.template_audit FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: feature_flags audit_trigger_row; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON core.feature_flags FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func('false', '{created_at,updated_at}');


--
-- Name: internal_feature_flags audit_trigger_row; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON core.internal_feature_flags FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func('false', '{created_at,updated_at}');


--
-- Name: organizations audit_trigger_row; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON core.organizations FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func('false', '{created_at,updated_at}');


--
-- Name: feature_flags audit_trigger_stm; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON core.feature_flags FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('false');


--
-- Name: internal_feature_flags audit_trigger_stm; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON core.internal_feature_flags FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('false');


--
-- Name: organizations audit_trigger_stm; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON core.organizations FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('false');


--
-- Name: auto_complete_interaction_guide_completions auto_complete_interaction_guide_completions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER auto_complete_interaction_guide_completions_modtime BEFORE UPDATE ON core.auto_complete_interaction_guide_completions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: auto_complete_interactions auto_complete_interactions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER auto_complete_interactions_modtime BEFORE UPDATE ON core.auto_complete_interactions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: users backup_deleted_user; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER backup_deleted_user AFTER DELETE ON core.users FOR EACH ROW EXECUTE FUNCTION audit.log_deleted_user();


--
-- Name: branching_paths branching_path_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER branching_path_modtime BEFORE UPDATE ON core.branching_paths FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: organizations create_organization_settings; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER create_organization_settings AFTER INSERT ON core.organizations FOR EACH ROW EXECUTE FUNCTION core.create_organization_settings_func();


--
-- Name: guide_base_step_auto_complete_interactions guide_base_step_auto_complete_interactions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER guide_base_step_auto_complete_interactions_modtime BEFORE UPDATE ON core.guide_base_step_auto_complete_interactions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_base_step_ctas guide_base_step_ctas_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER guide_base_step_ctas_modtime BEFORE UPDATE ON core.guide_base_step_ctas FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER guide_base_step_tagged_elements_modtime BEFORE UPDATE ON core.guide_base_step_tagged_elements FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: integration_api_keys integration_api_keys_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER integration_api_keys_modtime BEFORE UPDATE ON core.integration_api_keys FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: integration_template_selections integration_template_selections_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER integration_template_selections_modtime BEFORE UPDATE ON core.integration_template_selections FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: media_references media_references_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER media_references_modtime BEFORE UPDATE ON core.media_references FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: medias medias_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER medias_modtime BEFORE UPDATE ON core.medias FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: module_auto_launch_rules module_auto_launch_rules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER module_auto_launch_rules_modtime BEFORE UPDATE ON core.module_auto_launch_rules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: nps_participants nps_participants_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER nps_participants_modtime BEFORE UPDATE ON core.nps_participants FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: nps_survey_instances nps_survey_instances_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER nps_survey_instances_modtime BEFORE UPDATE ON core.nps_survey_instances FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: nps_surveys nps_surveys_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER nps_surveys_modtime BEFORE UPDATE ON core.nps_surveys FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: segment_examples segment_examples_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER segment_examples_modtime BEFORE UPDATE ON core.segment_examples FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: slack_auths slack_auth_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER slack_auth_modtime BEFORE UPDATE ON core.slack_auths FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_auto_complete_interactions step_auto_complete_interactions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_auto_complete_interactions_modtime BEFORE UPDATE ON core.step_auto_complete_interactions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_participants step_participants_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_participants_modtime BEFORE UPDATE ON core.step_participants FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_prototype_auto_complete_interactions step_prototype_auto_complete_interactions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_prototype_auto_complete_interactions_modtime BEFORE UPDATE ON core.step_prototype_auto_complete_interactions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_prototype_ctas step_prototype_ctas_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_prototype_ctas_modtime BEFORE UPDATE ON core.step_prototype_ctas FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_prototype_tagged_elements step_prototype_tagged_elements_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_prototype_tagged_elements_modtime BEFORE UPDATE ON core.step_prototype_tagged_elements FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_tagged_element_participants step_tagged_element_participants_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_tagged_element_participants_modtime BEFORE UPDATE ON core.step_tagged_element_participants FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_tagged_elements step_tagged_elements_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER step_tagged_elements_modtime BEFORE UPDATE ON core.step_tagged_elements FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: template_audiences template_audiences_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER template_audiences_modtime BEFORE UPDATE ON core.template_audiences FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: template_split_targets template_split_targets_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER template_split_targets_modtime BEFORE UPDATE ON core.template_split_targets FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER triggered_dynamic_modules_modtime BEFORE UPDATE ON core.triggered_dynamic_modules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: triggered_launch_ctas triggered_launch_ctas_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER triggered_launch_ctas_modtime BEFORE UPDATE ON core.triggered_launch_ctas FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: account_audit_logs update_account_audit_logs_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_account_audit_logs_modtime BEFORE UPDATE ON core.account_audit_logs FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: account_roles update_account_roles_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_account_roles_modtime BEFORE UPDATE ON core.account_roles FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: account_users update_account_users_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_account_users_modtime BEFORE UPDATE ON core.account_users FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: accounts update_accounts_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_accounts_modtime BEFORE UPDATE ON core.accounts FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: auto_launch_delete_log update_auto_launch_delete_log_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_auto_launch_delete_log_modtime BEFORE UPDATE ON core.auto_launch_delete_log FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: branching_action_triggers update_branching_action_triggers_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_branching_action_triggers_modtime BEFORE UPDATE ON core.branching_action_triggers FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: branching_actions update_branching_actions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_branching_actions_modtime BEFORE UPDATE ON core.branching_actions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: audiences update_core_audiences_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_core_audiences_modtime BEFORE UPDATE ON core.audiences FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: custom_attribute_values update_custom_attribute_values_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_custom_attribute_values_modtime BEFORE UPDATE ON core.custom_attribute_values FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: custom_attributes update_custom_attributes_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_custom_attributes_modtime BEFORE UPDATE ON core.custom_attributes FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: feature_flag_default_orgs update_feature_flag_default_orgs_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_feature_flag_default_orgs_modtime BEFORE UPDATE ON core.feature_flag_default_orgs FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: feature_flag_enabled update_feature_flag_enabled_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_feature_flag_enabled_modtime BEFORE UPDATE ON core.feature_flag_enabled FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: feature_flags update_feature_flags_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON core.feature_flags FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: file_uploads update_file_uploads_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_file_uploads_modtime BEFORE UPDATE ON core.file_uploads FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: global_default_templates update_global_default_templates_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_global_default_templates_modtime BEFORE UPDATE ON core.global_default_templates FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: google_auths update_google_auths_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_google_auths_modtime BEFORE UPDATE ON core.google_auths FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: google_drive_uploader_auths update_google_drive_uploader_auths_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_google_drive_uploader_auths_modtime BEFORE UPDATE ON core.google_drive_uploader_auths FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_bases update_guide_bases_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_guide_bases_modtime BEFORE UPDATE ON core.guide_bases FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_module_bases update_guide_module_bases_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_guide_module_bases_modtime BEFORE UPDATE ON core.guide_module_bases FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_modules update_guide_modules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_guide_modules_modtime BEFORE UPDATE ON core.guide_modules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_participants update_guide_participants_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_guide_participants_modtime BEFORE UPDATE ON core.guide_participants FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guide_step_bases update_guide_step_bases_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_guide_step_bases_modtime BEFORE UPDATE ON core.guide_step_bases FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: guides update_guides_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_guides_modtime BEFORE UPDATE ON core.guides FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: input_step_answers update_input_step_answers_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_input_step_answers_modtime BEFORE UPDATE ON core.input_step_answers FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: input_step_bases update_input_step_bases_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_input_step_bases_modtime BEFORE UPDATE ON core.input_step_bases FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: input_step_prototypes update_input_step_prototypes_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_input_step_prototypes_modtime BEFORE UPDATE ON core.input_step_prototypes FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: internal_feature_flags update_internal_feature_flags_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_internal_feature_flags_modtime BEFORE UPDATE ON core.internal_feature_flags FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: modules update_modules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_modules_modtime BEFORE UPDATE ON core.modules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: modules_step_prototypes update_modules_step_prototypes_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_modules_step_prototypes_modtime BEFORE UPDATE ON core.modules_step_prototypes FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: organization_hosts update_organization_hosts_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_organization_hosts_modtime BEFORE UPDATE ON core.organization_hosts FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: organization_inline_embeds update_organization_inline_embeds_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_organization_inline_embeds_modtime BEFORE UPDATE ON core.organization_inline_embeds FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: organizations update_organizations_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_organizations_modtime BEFORE UPDATE ON core.organizations FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: segment_api_keys update_segment_api_keys_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_segment_api_keys_modtime BEFORE UPDATE ON core.segment_api_keys FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_event_mapping_rules update_step_event_mapping_rules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_step_event_mapping_rules_modtime BEFORE UPDATE ON core.step_event_mapping_rules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_event_mappings update_step_event_mappings_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_step_event_mappings_modtime BEFORE UPDATE ON core.step_event_mappings FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: step_prototypes update_step_prototypes_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_step_prototypes_modtime BEFORE UPDATE ON core.step_prototypes FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: steps update_steps_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_steps_modtime BEFORE UPDATE ON core.steps FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: template_auto_launch_rules update_template_auto_launch_rules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_template_auto_launch_rules_modtime BEFORE UPDATE ON core.template_auto_launch_rules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: template_targets update_template_targets_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_template_targets_modtime BEFORE UPDATE ON core.template_targets FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: templates update_templates_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_templates_modtime BEFORE UPDATE ON core.templates FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: templates_modules update_templates_modules_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_templates_modules_modtime BEFORE UPDATE ON core.templates_modules FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: triggered_branching_actions update_triggered_branching_actions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_triggered_branching_actions_modtime BEFORE UPDATE ON core.triggered_branching_actions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: user_auths update_user_auths_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_user_auths_modtime BEFORE UPDATE ON core.user_auths FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: users update_users_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON core.users FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: users_organizations update_users_organizations_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER update_users_organizations_modtime BEFORE UPDATE ON core.users_organizations FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: visual_builder_sessions visual_builder_sessions_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER visual_builder_sessions_modtime BEFORE UPDATE ON core.visual_builder_sessions FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: webhooks webhook_modtime; Type: TRIGGER; Schema: core; Owner: -
--

CREATE TRIGGER webhook_modtime BEFORE UPDATE ON core.webhooks FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: launch_reports update_debug_launch_reports_modtime; Type: TRIGGER; Schema: debug; Owner: -
--

CREATE TRIGGER update_debug_launch_reports_modtime BEFORE UPDATE ON debug.launch_reports FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: report_dumps update_debug_report_dumps_modtime; Type: TRIGGER; Schema: debug; Owner: -
--

CREATE TRIGGER update_debug_report_dumps_modtime BEFORE UPDATE ON debug.report_dumps FOR EACH ROW EXECUTE FUNCTION core.update_modified_column();


--
-- Name: account_user_daily_log account_user_daily_log_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_daily_log
    ADD CONSTRAINT account_user_daily_log_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: account_user_data account_user_data_account_user_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_data
    ADD CONSTRAINT account_user_data_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: account_user_data account_user_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.account_user_data
    ADD CONSTRAINT account_user_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: announcement_daily_activity announcement_daily_activity_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.announcement_daily_activity
    ADD CONSTRAINT announcement_daily_activity_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: announcement_daily_activity announcement_daily_activity_template_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.announcement_daily_activity
    ADD CONSTRAINT announcement_daily_activity_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: captured_guide_analytics captured_guide_analytics_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.captured_guide_analytics
    ADD CONSTRAINT captured_guide_analytics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: captured_guide_analytics captured_guide_analytics_template_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.captured_guide_analytics
    ADD CONSTRAINT captured_guide_analytics_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: data_usage data_usage_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.data_usage
    ADD CONSTRAINT data_usage_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: diagnostics_events diagnostics_events_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.diagnostics_events
    ADD CONSTRAINT diagnostics_events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_daily_rollup guide_daily_rollup_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_daily_rollup
    ADD CONSTRAINT guide_daily_rollup_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_data guide_data_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_data
    ADD CONSTRAINT guide_data_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: guide_data guide_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.guide_data
    ADD CONSTRAINT guide_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_data organization_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.organization_data
    ADD CONSTRAINT organization_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_daily_rollup step_daily_rollup_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_daily_rollup
    ADD CONSTRAINT step_daily_rollup_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_daily_rollup step_daily_rollup_step_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_daily_rollup
    ADD CONSTRAINT step_daily_rollup_step_id_fkey FOREIGN KEY (step_id) REFERENCES core.steps(id) ON DELETE CASCADE;


--
-- Name: step_daily_rollup step_daily_rollup_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_daily_rollup
    ADD CONSTRAINT step_daily_rollup_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE SET NULL;


--
-- Name: step_data step_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_data
    ADD CONSTRAINT step_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_data step_data_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_data
    ADD CONSTRAINT step_data_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id);


--
-- Name: step_data step_data_template_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.step_data
    ADD CONSTRAINT step_data_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: template_data template_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.template_data
    ADD CONSTRAINT template_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: template_data template_data_template_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.template_data
    ADD CONSTRAINT template_data_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: value_data value_data_organization_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.value_data
    ADD CONSTRAINT value_data_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_base_audit guide_base_audit_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.guide_base_audit
    ADD CONSTRAINT guide_base_audit_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: guide_base_audit guide_base_audit_organization_id_fkey; Type: FK CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.guide_base_audit
    ADD CONSTRAINT guide_base_audit_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_base_audit guide_base_audit_user_id_fkey; Type: FK CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.guide_base_audit
    ADD CONSTRAINT guide_base_audit_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: module_audit module_audit_module_id_fkey; Type: FK CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.module_audit
    ADD CONSTRAINT module_audit_module_id_fkey FOREIGN KEY (module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: template_audit template_audit_organization_id_fkey; Type: FK CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.template_audit
    ADD CONSTRAINT template_audit_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: account_audit_logs account_audit_logs_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_audit_logs
    ADD CONSTRAINT account_audit_logs_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: account_audit_logs account_audit_logs_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_audit_logs
    ADD CONSTRAINT account_audit_logs_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE SET NULL;


--
-- Name: account_audit_logs account_audit_logs_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_audit_logs
    ADD CONSTRAINT account_audit_logs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: account_roles account_roles_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_roles
    ADD CONSTRAINT account_roles_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: account_roles account_roles_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_roles
    ADD CONSTRAINT account_roles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: account_users account_users_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_users
    ADD CONSTRAINT account_users_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: account_users account_users_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.account_users
    ADD CONSTRAINT account_users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: accounts accounts_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.accounts
    ADD CONSTRAINT accounts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: accounts accounts_primary_organization_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.accounts
    ADD CONSTRAINT accounts_primary_organization_user_id_fkey FOREIGN KEY (primary_organization_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: audiences audiences_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.audiences
    ADD CONSTRAINT audiences_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: auto_complete_interaction_guide_completions auto_complete_interaction_gui_auto_complete_interaction_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interaction_guide_completions
    ADD CONSTRAINT auto_complete_interaction_gui_auto_complete_interaction_id_fkey FOREIGN KEY (auto_complete_interaction_id) REFERENCES core.auto_complete_interactions(id) ON DELETE CASCADE;


--
-- Name: auto_complete_interaction_guide_completions auto_complete_interaction_guide_completion_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interaction_guide_completions
    ADD CONSTRAINT auto_complete_interaction_guide_completion_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: auto_complete_interaction_guide_completions auto_complete_interaction_guide_completions_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interaction_guide_completions
    ADD CONSTRAINT auto_complete_interaction_guide_completions_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: auto_complete_interactions auto_complete_interactions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_complete_interactions
    ADD CONSTRAINT auto_complete_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: auto_launch_delete_log auto_launch_delete_log_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_delete_log
    ADD CONSTRAINT auto_launch_delete_log_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: auto_launch_delete_log auto_launch_delete_log_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_delete_log
    ADD CONSTRAINT auto_launch_delete_log_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: auto_launch_delete_log auto_launch_delete_log_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_delete_log
    ADD CONSTRAINT auto_launch_delete_log_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: auto_launch_log auto_launch_log_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log
    ADD CONSTRAINT auto_launch_log_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: auto_launch_log auto_launch_log_created_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log
    ADD CONSTRAINT auto_launch_log_created_guide_base_id_fkey FOREIGN KEY (created_guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: auto_launch_log auto_launch_log_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log
    ADD CONSTRAINT auto_launch_log_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: auto_launch_log auto_launch_log_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.auto_launch_log
    ADD CONSTRAINT auto_launch_log_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: batched_notifications batched_notifications_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.batched_notifications
    ADD CONSTRAINT batched_notifications_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: branching_action_triggers branching_action_triggers_branching_action_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_branching_action_id_fkey FOREIGN KEY (branching_action_id) REFERENCES core.branching_actions(id) ON DELETE CASCADE;


--
-- Name: branching_action_triggers branching_action_triggers_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: branching_action_triggers branching_action_triggers_upon_completion_of_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_upon_completion_of_module_id_fkey FOREIGN KEY (upon_completion_of_module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: branching_action_triggers branching_action_triggers_upon_completion_of_step_prototyp_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_upon_completion_of_step_prototyp_fkey FOREIGN KEY (upon_completion_of_step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: branching_action_triggers branching_action_triggers_upon_completion_of_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_action_triggers
    ADD CONSTRAINT branching_action_triggers_upon_completion_of_template_id_fkey FOREIGN KEY (upon_completion_of_template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: branching_actions branching_actions_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_actions
    ADD CONSTRAINT branching_actions_module_id_fkey FOREIGN KEY (module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: branching_actions branching_actions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_actions
    ADD CONSTRAINT branching_actions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: branching_actions branching_actions_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_actions
    ADD CONSTRAINT branching_actions_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: branching_paths branching_paths_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_paths
    ADD CONSTRAINT branching_paths_module_id_fkey FOREIGN KEY (module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: branching_paths branching_paths_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_paths
    ADD CONSTRAINT branching_paths_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: branching_paths branching_paths_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.branching_paths
    ADD CONSTRAINT branching_paths_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: templates created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: modules created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: step_prototypes created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: guide_module_bases created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: guide_bases created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: guide_step_bases created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: webhooks created_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.webhooks
    ADD CONSTRAINT created_by_user_fk FOREIGN KEY (created_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: custom_api_events custom_api_events_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_api_events
    ADD CONSTRAINT custom_api_events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: custom_attribute_values custom_attribute_values_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values
    ADD CONSTRAINT custom_attribute_values_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: custom_attribute_values custom_attribute_values_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values
    ADD CONSTRAINT custom_attribute_values_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: custom_attribute_values custom_attribute_values_custom_attribute_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values
    ADD CONSTRAINT custom_attribute_values_custom_attribute_id_fkey FOREIGN KEY (custom_attribute_id) REFERENCES core.custom_attributes(id) ON DELETE CASCADE;


--
-- Name: custom_attribute_values custom_attribute_values_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attribute_values
    ADD CONSTRAINT custom_attribute_values_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: custom_attributes custom_attributes_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.custom_attributes
    ADD CONSTRAINT custom_attributes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: feature_flag_default_orgs feature_flag_default_orgs_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_default_orgs
    ADD CONSTRAINT feature_flag_default_orgs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: feature_flag_enabled feature_flag_enabled_feature_flag_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_enabled
    ADD CONSTRAINT feature_flag_enabled_feature_flag_id_fkey FOREIGN KEY (feature_flag_id) REFERENCES core.feature_flags(id) ON DELETE CASCADE;


--
-- Name: feature_flag_enabled feature_flag_enabled_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.feature_flag_enabled
    ADD CONSTRAINT feature_flag_enabled_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: file_uploads file_uploads_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.file_uploads
    ADD CONSTRAINT file_uploads_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: file_uploads file_uploads_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.file_uploads
    ADD CONSTRAINT file_uploads_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: file_uploads file_uploads_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.file_uploads
    ADD CONSTRAINT file_uploads_step_id_fkey FOREIGN KEY (step_id) REFERENCES core.steps(id) ON DELETE CASCADE;


--
-- Name: global_default_templates global_default_templates_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.global_default_templates
    ADD CONSTRAINT global_default_templates_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: google_auths google_auths_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.google_auths
    ADD CONSTRAINT google_auths_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_auto_complete_interactions guide_base_step_auto_complete_created_from_step_prototype__fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_auto_complete_interactions
    ADD CONSTRAINT guide_base_step_auto_complete_created_from_step_prototype__fkey FOREIGN KEY (created_from_step_prototype_auto_complete_interaction_id) REFERENCES core.step_prototype_auto_complete_interactions(id) ON DELETE SET NULL;


--
-- Name: guide_base_step_auto_complete_interactions guide_base_step_auto_complete_interacti_guide_base_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_auto_complete_interactions
    ADD CONSTRAINT guide_base_step_auto_complete_interacti_guide_base_step_id_fkey FOREIGN KEY (guide_base_step_id) REFERENCES core.guide_step_bases(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_auto_complete_interactions guide_base_step_auto_complete_interactions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_auto_complete_interactions
    ADD CONSTRAINT guide_base_step_auto_complete_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_ctas guide_base_step_ctas_created_from_step_prototype_cta_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas
    ADD CONSTRAINT guide_base_step_ctas_created_from_step_prototype_cta_id_fkey FOREIGN KEY (created_from_step_prototype_cta_id) REFERENCES core.step_prototype_ctas(id) ON DELETE SET NULL;


--
-- Name: guide_base_step_ctas guide_base_step_ctas_guide_base_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas
    ADD CONSTRAINT guide_base_step_ctas_guide_base_step_id_fkey FOREIGN KEY (guide_base_step_id) REFERENCES core.guide_step_bases(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_ctas guide_base_step_ctas_launchable_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas
    ADD CONSTRAINT guide_base_step_ctas_launchable_template_id_fkey FOREIGN KEY (launchable_template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_ctas guide_base_step_ctas_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_ctas
    ADD CONSTRAINT guide_base_step_ctas_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_created_from_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements
    ADD CONSTRAINT guide_base_step_tagged_elements_created_from_prototype_id_fkey FOREIGN KEY (created_from_prototype_id) REFERENCES core.step_prototype_tagged_elements(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements
    ADD CONSTRAINT guide_base_step_tagged_elements_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_guide_base_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements
    ADD CONSTRAINT guide_base_step_tagged_elements_guide_base_step_id_fkey FOREIGN KEY (guide_base_step_id) REFERENCES core.guide_step_bases(id) ON DELETE CASCADE;


--
-- Name: guide_base_step_tagged_elements guide_base_step_tagged_elements_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_base_step_tagged_elements
    ADD CONSTRAINT guide_base_step_tagged_elements_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_bases guide_bases_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT guide_bases_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: guide_bases guide_bases_created_from_split_test_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT guide_bases_created_from_split_test_id_fkey FOREIGN KEY (created_from_split_test_id) REFERENCES core.templates(id) ON DELETE SET NULL;


--
-- Name: guide_bases guide_bases_created_from_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT guide_bases_created_from_template_id_fkey FOREIGN KEY (created_from_template_id) REFERENCES core.templates(id) ON DELETE SET NULL;


--
-- Name: guide_bases guide_bases_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT guide_bases_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_module_bases guide_module_bases_created_from_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT guide_module_bases_created_from_module_id_fkey FOREIGN KEY (created_from_module_id) REFERENCES core.modules(id) ON DELETE SET NULL;


--
-- Name: guide_module_bases guide_module_bases_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT guide_module_bases_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: guide_module_bases guide_module_bases_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT guide_module_bases_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_modules guide_modules_created_from_guide_module_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT guide_modules_created_from_guide_module_base_id_fkey FOREIGN KEY (created_from_guide_module_base_id) REFERENCES core.guide_module_bases(id) ON DELETE CASCADE;


--
-- Name: guide_modules guide_modules_created_from_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT guide_modules_created_from_module_id_fkey FOREIGN KEY (created_from_module_id) REFERENCES core.modules(id) ON DELETE SET NULL;


--
-- Name: guide_modules guide_modules_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT guide_modules_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: guide_modules guide_modules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_modules
    ADD CONSTRAINT guide_modules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_participants guide_participants_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants
    ADD CONSTRAINT guide_participants_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: guide_participants guide_participants_created_from_guide_target_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants
    ADD CONSTRAINT guide_participants_created_from_guide_target_id_fkey FOREIGN KEY (created_from_guide_target_id) REFERENCES core.guide_targets(id) ON DELETE SET NULL;


--
-- Name: guide_participants guide_participants_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants
    ADD CONSTRAINT guide_participants_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: guide_participants guide_participants_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_participants
    ADD CONSTRAINT guide_participants_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_step_bases guide_step_bases_created_from_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT guide_step_bases_created_from_step_prototype_id_fkey FOREIGN KEY (created_from_step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE SET NULL;


--
-- Name: guide_step_bases guide_step_bases_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT guide_step_bases_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: guide_step_bases guide_step_bases_guide_module_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT guide_step_bases_guide_module_base_id_fkey FOREIGN KEY (guide_module_base_id) REFERENCES core.guide_module_bases(id) ON DELETE CASCADE;


--
-- Name: guide_step_bases guide_step_bases_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT guide_step_bases_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guide_targets guide_targets_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_targets
    ADD CONSTRAINT guide_targets_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE CASCADE;


--
-- Name: guide_targets guide_targets_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_targets
    ADD CONSTRAINT guide_targets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: guides guides_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides
    ADD CONSTRAINT guides_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE CASCADE;


--
-- Name: guides guides_created_from_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides
    ADD CONSTRAINT guides_created_from_guide_base_id_fkey FOREIGN KEY (created_from_guide_base_id) REFERENCES core.guide_bases(id) ON DELETE SET NULL;


--
-- Name: guides guides_created_from_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides
    ADD CONSTRAINT guides_created_from_template_id_fkey FOREIGN KEY (created_from_template_id) REFERENCES core.templates(id) ON DELETE SET NULL;


--
-- Name: guides guides_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guides
    ADD CONSTRAINT guides_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: input_step_answers input_step_answers_answered_by_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers
    ADD CONSTRAINT input_step_answers_answered_by_account_user_id_fkey FOREIGN KEY (answered_by_account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: input_step_answers input_step_answers_input_step_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers
    ADD CONSTRAINT input_step_answers_input_step_base_id_fkey FOREIGN KEY (input_step_base_id) REFERENCES core.input_step_bases(id) ON DELETE SET NULL;


--
-- Name: input_step_answers input_step_answers_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers
    ADD CONSTRAINT input_step_answers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: input_step_answers input_step_answers_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_answers
    ADD CONSTRAINT input_step_answers_step_id_fkey FOREIGN KEY (step_id) REFERENCES core.steps(id) ON DELETE SET NULL;


--
-- Name: input_step_bases input_step_bases_created_from_input_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_bases
    ADD CONSTRAINT input_step_bases_created_from_input_step_prototype_id_fkey FOREIGN KEY (created_from_input_step_prototype_id) REFERENCES core.input_step_prototypes(id) ON DELETE SET NULL;


--
-- Name: input_step_bases input_step_bases_guide_step_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_bases
    ADD CONSTRAINT input_step_bases_guide_step_base_id_fkey FOREIGN KEY (guide_step_base_id) REFERENCES core.guide_step_bases(id) ON DELETE CASCADE;


--
-- Name: input_step_bases input_step_bases_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_bases
    ADD CONSTRAINT input_step_bases_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: input_step_prototypes input_step_prototypes_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_prototypes
    ADD CONSTRAINT input_step_prototypes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: input_step_prototypes input_step_prototypes_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.input_step_prototypes
    ADD CONSTRAINT input_step_prototypes_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: integration_api_keys integration_api_keys_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_api_keys
    ADD CONSTRAINT integration_api_keys_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: integration_template_selections integration_template_selections_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_template_selections
    ADD CONSTRAINT integration_template_selections_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: integration_template_selections integration_template_selections_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.integration_template_selections
    ADD CONSTRAINT integration_template_selections_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: media_references media_references_media_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.media_references
    ADD CONSTRAINT media_references_media_id_fkey FOREIGN KEY (media_id) REFERENCES core.medias(id) ON DELETE CASCADE;


--
-- Name: media_references media_references_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.media_references
    ADD CONSTRAINT media_references_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: medias medias_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.medias
    ADD CONSTRAINT medias_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: module_auto_launch_rules module_auto_launch_rules_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.module_auto_launch_rules
    ADD CONSTRAINT module_auto_launch_rules_module_id_fkey FOREIGN KEY (module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: module_auto_launch_rules module_auto_launch_rules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.module_auto_launch_rules
    ADD CONSTRAINT module_auto_launch_rules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: module_auto_launch_rules module_auto_launch_rules_target_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.module_auto_launch_rules
    ADD CONSTRAINT module_auto_launch_rules_target_template_id_fkey FOREIGN KEY (target_template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: modules modules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules
    ADD CONSTRAINT modules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: modules_step_prototypes modules_step_prototypes_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules_step_prototypes
    ADD CONSTRAINT modules_step_prototypes_module_id_fkey FOREIGN KEY (module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: modules_step_prototypes modules_step_prototypes_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules_step_prototypes
    ADD CONSTRAINT modules_step_prototypes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: modules_step_prototypes modules_step_prototypes_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules_step_prototypes
    ADD CONSTRAINT modules_step_prototypes_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: nps_participants nps_participants_account_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants
    ADD CONSTRAINT nps_participants_account_id_fkey FOREIGN KEY (account_id) REFERENCES core.accounts(id) ON DELETE SET NULL;


--
-- Name: nps_participants nps_participants_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants
    ADD CONSTRAINT nps_participants_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: nps_participants nps_participants_nps_survey_instance_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants
    ADD CONSTRAINT nps_participants_nps_survey_instance_id_fkey FOREIGN KEY (nps_survey_instance_id) REFERENCES core.nps_survey_instances(id) ON DELETE SET NULL;


--
-- Name: nps_participants nps_participants_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_participants
    ADD CONSTRAINT nps_participants_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: nps_survey_instances nps_survey_instances_created_from_nps_survey_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_survey_instances
    ADD CONSTRAINT nps_survey_instances_created_from_nps_survey_id_fkey FOREIGN KEY (created_from_nps_survey_id) REFERENCES core.nps_surveys(id) ON DELETE SET NULL;


--
-- Name: nps_survey_instances nps_survey_instances_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_survey_instances
    ADD CONSTRAINT nps_survey_instances_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: nps_surveys nps_surveys_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.nps_surveys
    ADD CONSTRAINT nps_surveys_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_hosts organization_hosts_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_hosts
    ADD CONSTRAINT organization_hosts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_inline_embeds organization_inline_embeds_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_inline_embeds
    ADD CONSTRAINT organization_inline_embeds_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_inline_embeds organization_inline_embeds_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_inline_embeds
    ADD CONSTRAINT organization_inline_embeds_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: organization_settings organization_settings_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organization_settings
    ADD CONSTRAINT organization_settings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: organizations owned_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.organizations
    ADD CONSTRAINT owned_by_user_fk FOREIGN KEY (owned_by_user_id) REFERENCES core.users(id);


--
-- Name: segment_api_keys segment_api_keys_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_api_keys
    ADD CONSTRAINT segment_api_keys_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: segment_examples segment_examples_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.segment_examples
    ADD CONSTRAINT segment_examples_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: slack_auths slack_auths_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.slack_auths
    ADD CONSTRAINT slack_auths_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_auto_complete_interactions step_auto_complete_interactio_created_from_guide_base_step_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_auto_complete_interactions
    ADD CONSTRAINT step_auto_complete_interactio_created_from_guide_base_step_fkey FOREIGN KEY (created_from_guide_base_step_auto_complete_interaction_id) REFERENCES core.guide_base_step_auto_complete_interactions(id) ON DELETE SET NULL;


--
-- Name: step_auto_complete_interactions step_auto_complete_interactions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_auto_complete_interactions
    ADD CONSTRAINT step_auto_complete_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_auto_complete_interactions step_auto_complete_interactions_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_auto_complete_interactions
    ADD CONSTRAINT step_auto_complete_interactions_step_id_fkey FOREIGN KEY (step_id) REFERENCES core.steps(id) ON DELETE CASCADE;


--
-- Name: step_event_mapping_rules step_event_mapping_rules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mapping_rules
    ADD CONSTRAINT step_event_mapping_rules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_event_mapping_rules step_event_mapping_rules_step_event_mapping_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mapping_rules
    ADD CONSTRAINT step_event_mapping_rules_step_event_mapping_id_fkey FOREIGN KEY (step_event_mapping_id) REFERENCES core.step_event_mappings(id) ON DELETE CASCADE;


--
-- Name: step_event_mappings step_event_mappings_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mappings
    ADD CONSTRAINT step_event_mappings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_event_mappings step_event_mappings_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_event_mappings
    ADD CONSTRAINT step_event_mappings_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: step_participants step_participants_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_participants
    ADD CONSTRAINT step_participants_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: step_participants step_participants_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_participants
    ADD CONSTRAINT step_participants_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_participants step_participants_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_participants
    ADD CONSTRAINT step_participants_step_id_fkey FOREIGN KEY (step_id) REFERENCES core.steps(id) ON DELETE CASCADE;


--
-- Name: step_prototype_auto_complete_interactions step_prototype_auto_complete_interaction_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_auto_complete_interactions
    ADD CONSTRAINT step_prototype_auto_complete_interaction_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: step_prototype_auto_complete_interactions step_prototype_auto_complete_interactions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_auto_complete_interactions
    ADD CONSTRAINT step_prototype_auto_complete_interactions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_prototype_ctas step_prototype_ctas_launchable_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_ctas
    ADD CONSTRAINT step_prototype_ctas_launchable_template_id_fkey FOREIGN KEY (launchable_template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: step_prototype_ctas step_prototype_ctas_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_ctas
    ADD CONSTRAINT step_prototype_ctas_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_prototype_ctas step_prototype_ctas_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_ctas
    ADD CONSTRAINT step_prototype_ctas_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: step_prototype_tagged_elements step_prototype_tagged_elements_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_tagged_elements
    ADD CONSTRAINT step_prototype_tagged_elements_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_prototype_tagged_elements step_prototype_tagged_elements_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_tagged_elements
    ADD CONSTRAINT step_prototype_tagged_elements_step_prototype_id_fkey FOREIGN KEY (step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE CASCADE;


--
-- Name: step_prototype_tagged_elements step_prototype_tagged_elements_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototype_tagged_elements
    ADD CONSTRAINT step_prototype_tagged_elements_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: step_prototypes step_prototypes_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes
    ADD CONSTRAINT step_prototypes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_tagged_element_participants step_tagged_element_participants_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_element_participants
    ADD CONSTRAINT step_tagged_element_participants_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: step_tagged_element_participants step_tagged_element_participants_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_element_participants
    ADD CONSTRAINT step_tagged_element_participants_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_tagged_element_participants step_tagged_element_participants_step_tagged_element_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_element_participants
    ADD CONSTRAINT step_tagged_element_participants_step_tagged_element_id_fkey FOREIGN KEY (step_tagged_element_id) REFERENCES core.step_tagged_elements(id) ON DELETE CASCADE;


--
-- Name: step_tagged_elements step_tagged_elements_created_from_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_created_from_base_id_fkey FOREIGN KEY (created_from_base_id) REFERENCES core.guide_base_step_tagged_elements(id) ON DELETE CASCADE;


--
-- Name: step_tagged_elements step_tagged_elements_created_from_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_created_from_prototype_id_fkey FOREIGN KEY (created_from_prototype_id) REFERENCES core.step_prototype_tagged_elements(id) ON DELETE SET NULL;


--
-- Name: step_tagged_elements step_tagged_elements_guide_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_guide_base_id_fkey FOREIGN KEY (guide_base_id) REFERENCES core.guide_bases(id) ON DELETE SET NULL;


--
-- Name: step_tagged_elements step_tagged_elements_guide_base_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_guide_base_step_id_fkey FOREIGN KEY (guide_base_step_id) REFERENCES core.guide_step_bases(id) ON DELETE SET NULL;


--
-- Name: step_tagged_elements step_tagged_elements_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES core.guides(id) ON DELETE SET NULL NOT VALID;


--
-- Name: step_tagged_elements step_tagged_elements_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: step_tagged_elements step_tagged_elements_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_tagged_elements
    ADD CONSTRAINT step_tagged_elements_step_id_fkey FOREIGN KEY (step_id) REFERENCES core.steps(id) ON DELETE SET NULL NOT VALID;


--
-- Name: steps steps_completed_by_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_completed_by_account_user_id_fkey FOREIGN KEY (completed_by_account_user_id) REFERENCES core.account_users(id) ON DELETE SET NULL;


--
-- Name: steps steps_completed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_completed_by_user_id_fkey FOREIGN KEY (completed_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: steps steps_created_from_guide_step_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_created_from_guide_step_base_id_fkey FOREIGN KEY (created_from_guide_step_base_id) REFERENCES core.guide_step_bases(id) ON DELETE CASCADE;


--
-- Name: steps steps_created_from_step_prototype_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_created_from_step_prototype_id_fkey FOREIGN KEY (created_from_step_prototype_id) REFERENCES core.step_prototypes(id) ON DELETE SET NULL;


--
-- Name: steps steps_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: steps steps_guide_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_guide_module_id_fkey FOREIGN KEY (guide_module_id) REFERENCES core.guide_modules(id) ON DELETE CASCADE;


--
-- Name: steps steps_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.steps
    ADD CONSTRAINT steps_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: template_audiences template_audiences_audience_entity_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_audiences
    ADD CONSTRAINT template_audiences_audience_entity_id_fkey FOREIGN KEY (audience_entity_id) REFERENCES core.audiences(entity_id) ON DELETE CASCADE;


--
-- Name: template_audiences template_audiences_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_audiences
    ADD CONSTRAINT template_audiences_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: template_audiences template_audiences_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_audiences
    ADD CONSTRAINT template_audiences_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: template_auto_launch_rules template_auto_launch_rules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_auto_launch_rules
    ADD CONSTRAINT template_auto_launch_rules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: template_auto_launch_rules template_auto_launch_rules_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_auto_launch_rules
    ADD CONSTRAINT template_auto_launch_rules_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: template_split_targets template_split_targets_destination_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_split_targets
    ADD CONSTRAINT template_split_targets_destination_template_id_fkey FOREIGN KEY (destination_template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: template_split_targets template_split_targets_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_split_targets
    ADD CONSTRAINT template_split_targets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: template_split_targets template_split_targets_source_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_split_targets
    ADD CONSTRAINT template_split_targets_source_template_id_fkey FOREIGN KEY (source_template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: template_targets template_targets_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_targets
    ADD CONSTRAINT template_targets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: template_targets template_targets_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.template_targets
    ADD CONSTRAINT template_targets_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: templates_modules templates_modules_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules
    ADD CONSTRAINT templates_modules_module_id_fkey FOREIGN KEY (module_id) REFERENCES core.modules(id) ON DELETE CASCADE;


--
-- Name: templates_modules templates_modules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules
    ADD CONSTRAINT templates_modules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: templates_modules templates_modules_template_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates_modules
    ADD CONSTRAINT templates_modules_template_id_fkey FOREIGN KEY (template_id) REFERENCES core.templates(id) ON DELETE CASCADE;


--
-- Name: templates templates_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates
    ADD CONSTRAINT templates_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE SET NULL;


--
-- Name: triggered_branching_actions triggered_branching_actions_branching_action_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_branching_action_id_fkey FOREIGN KEY (branching_action_id) REFERENCES core.branching_actions(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_branching_action_trigger_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_branching_action_trigger_id_fkey FOREIGN KEY (branching_action_trigger_id) REFERENCES core.branching_action_triggers(id) ON DELETE SET NULL;


--
-- Name: triggered_branching_actions triggered_branching_actions_created_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_created_guide_id_fkey FOREIGN KEY (created_guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_created_guide_module_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_created_guide_module_base_id_fkey FOREIGN KEY (created_guide_module_base_id) REFERENCES core.guide_module_bases(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_created_guide_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_created_guide_module_id_fkey FOREIGN KEY (created_guide_module_id) REFERENCES core.guide_modules(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_triggered_from_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_triggered_from_guide_id_fkey FOREIGN KEY (triggered_from_guide_id) REFERENCES core.guides(id) ON DELETE SET NULL;


--
-- Name: triggered_branching_actions triggered_branching_actions_triggered_from_guide_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_triggered_from_guide_module_id_fkey FOREIGN KEY (triggered_from_guide_module_id) REFERENCES core.guide_modules(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_actions triggered_branching_actions_triggered_from_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_actions
    ADD CONSTRAINT triggered_branching_actions_triggered_from_step_id_fkey FOREIGN KEY (triggered_from_step_id) REFERENCES core.steps(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_paths triggered_branching_paths_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE SET NULL;


--
-- Name: triggered_branching_paths triggered_branching_paths_branching_path_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_branching_path_id_fkey FOREIGN KEY (branching_path_id) REFERENCES core.branching_paths(id) ON DELETE SET NULL;


--
-- Name: triggered_branching_paths triggered_branching_paths_created_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_created_guide_id_fkey FOREIGN KEY (created_guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_paths triggered_branching_paths_created_guide_module_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_created_guide_module_base_id_fkey FOREIGN KEY (created_guide_module_base_id) REFERENCES core.guide_module_bases(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_paths triggered_branching_paths_created_guide_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_created_guide_module_id_fkey FOREIGN KEY (created_guide_module_id) REFERENCES core.guide_modules(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_paths triggered_branching_paths_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: triggered_branching_paths triggered_branching_paths_triggered_from_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_triggered_from_guide_id_fkey FOREIGN KEY (triggered_from_guide_id) REFERENCES core.guides(id) ON DELETE SET NULL;


--
-- Name: triggered_branching_paths triggered_branching_paths_triggered_from_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_branching_paths
    ADD CONSTRAINT triggered_branching_paths_triggered_from_step_id_fkey FOREIGN KEY (triggered_from_step_id) REFERENCES core.steps(id) ON DELETE SET NULL;


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_created_guide_module_base_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules
    ADD CONSTRAINT triggered_dynamic_modules_created_guide_module_base_id_fkey FOREIGN KEY (created_guide_module_base_id) REFERENCES core.guide_module_bases(id) ON DELETE CASCADE;


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_created_guide_module_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules
    ADD CONSTRAINT triggered_dynamic_modules_created_guide_module_id_fkey FOREIGN KEY (created_guide_module_id) REFERENCES core.guide_modules(id) ON DELETE CASCADE;


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_module_auto_launch_rule_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules
    ADD CONSTRAINT triggered_dynamic_modules_module_auto_launch_rule_fkey FOREIGN KEY (module_auto_launch_rule) REFERENCES core.module_auto_launch_rules(id) ON DELETE SET NULL;


--
-- Name: triggered_dynamic_modules triggered_dynamic_modules_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_dynamic_modules
    ADD CONSTRAINT triggered_dynamic_modules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: triggered_launch_ctas triggered_launch_ctas_account_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_account_user_id_fkey FOREIGN KEY (account_user_id) REFERENCES core.account_users(id) ON DELETE CASCADE;


--
-- Name: triggered_launch_ctas triggered_launch_ctas_created_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_created_guide_id_fkey FOREIGN KEY (created_guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: triggered_launch_ctas triggered_launch_ctas_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: triggered_launch_ctas triggered_launch_ctas_triggered_from_guide_base_cta_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_triggered_from_guide_base_cta_id_fkey FOREIGN KEY (triggered_from_guide_base_cta_id) REFERENCES core.guide_base_step_ctas(id) ON DELETE SET NULL;


--
-- Name: triggered_launch_ctas triggered_launch_ctas_triggered_from_guide_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_triggered_from_guide_id_fkey FOREIGN KEY (triggered_from_guide_id) REFERENCES core.guides(id) ON DELETE CASCADE;


--
-- Name: triggered_launch_ctas triggered_launch_ctas_triggered_from_step_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.triggered_launch_ctas
    ADD CONSTRAINT triggered_launch_ctas_triggered_from_step_id_fkey FOREIGN KEY (triggered_from_step_id) REFERENCES core.steps(id) ON DELETE CASCADE;


--
-- Name: templates udpated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.templates
    ADD CONSTRAINT udpated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: modules udpated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.modules
    ADD CONSTRAINT udpated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: step_prototypes updated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.step_prototypes
    ADD CONSTRAINT updated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: guide_module_bases updated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_module_bases
    ADD CONSTRAINT updated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: guide_bases updated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_bases
    ADD CONSTRAINT updated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: guide_step_bases updated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.guide_step_bases
    ADD CONSTRAINT updated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: webhooks updated_by_user_fk; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.webhooks
    ADD CONSTRAINT updated_by_user_fk FOREIGN KEY (updated_by_user_id) REFERENCES core.users(id) ON DELETE SET NULL;


--
-- Name: user_auths user_auths_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.user_auths
    ADD CONSTRAINT user_auths_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


--
-- Name: users users_google_auth_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_google_auth_id_fkey FOREIGN KEY (google_auth_id) REFERENCES core.google_auths(id) ON DELETE SET NULL;


--
-- Name: users users_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users
    ADD CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: users_organizations users_organizations_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users_organizations
    ADD CONSTRAINT users_organizations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: users_organizations users_organizations_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.users_organizations
    ADD CONSTRAINT users_organizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


--
-- Name: visual_builder_sessions visual_builder_sessions_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.visual_builder_sessions
    ADD CONSTRAINT visual_builder_sessions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- Name: visual_builder_sessions visual_builder_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.visual_builder_sessions
    ADD CONSTRAINT visual_builder_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE;


--
-- Name: webhooks webhooks_organization_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.webhooks
    ADD CONSTRAINT webhooks_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES core.organizations(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

