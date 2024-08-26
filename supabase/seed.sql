SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a5b0de91-2674-44ee-9ce4-d2722fbd68bc', '{"action":"user_signedup","actor_id":"5355d505-8cf5-43c1-aaf3-af4f3eb9c984","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2024-08-25 19:09:45.408177+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd97481e9-96d2-422a-a543-94018f1756ab', '{"action":"login","actor_id":"5355d505-8cf5-43c1-aaf3-af4f3eb9c984","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-08-25 19:09:47.328225+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '5355d505-8cf5-43c1-aaf3-af4f3eb9c984', 'authenticated', 'authenticated', 'bengardiner18@gmail.com', '', '2024-08-25 19:09:45.411955+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-08-25 19:09:47.330542+00', '{"provider": "github", "providers": ["github"]}', '{"iss": "https://api.github.com", "sub": "38408476", "name": "Ben Gardiner", "email": "bengardiner18@gmail.com", "full_name": "Ben Gardiner", "user_name": "BenGardiner18", "avatar_url": "https://avatars.githubusercontent.com/u/38408476?v=4", "provider_id": "38408476", "email_verified": true, "phone_verified": false, "preferred_username": "BenGardiner18"}', NULL, '2024-08-25 19:09:45.389083+00', '2024-08-25 19:09:47.346643+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('38408476', '5355d505-8cf5-43c1-aaf3-af4f3eb9c984', '{"iss": "https://api.github.com", "sub": "38408476", "name": "Ben Gardiner", "email": "bengardiner18@gmail.com", "full_name": "Ben Gardiner", "user_name": "BenGardiner18", "avatar_url": "https://avatars.githubusercontent.com/u/38408476?v=4", "provider_id": "38408476", "email_verified": true, "phone_verified": false, "preferred_username": "BenGardiner18"}', 'github', '2024-08-25 19:09:45.401523+00', '2024-08-25 19:09:45.40156+00', '2024-08-25 19:09:45.40156+00', '3fd65d69-b921-433e-b6a0-79f5c25160d8');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('6677ac6b-3402-4790-a341-08c3f6380678', '5355d505-8cf5-43c1-aaf3-af4f3eb9c984', '2024-08-25 19:09:47.330895+00', '2024-08-25 19:09:47.330895+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('6677ac6b-3402-4790-a341-08c3f6380678', '2024-08-25 19:09:47.347419+00', '2024-08-25 19:09:47.347419+00', 'oauth', '5aae1885-7a9e-4c78-95fb-23c17cae4cc5');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, '3Mf0OtGca0x8Y8EjW-Xw7g', '5355d505-8cf5-43c1-aaf3-af4f3eb9c984', false, '2024-08-25 19:09:47.343211+00', '2024-08-25 19:09:47.343211+00', NULL, '6677ac6b-3402-4790-a341-08c3f6380678');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: applicants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "full_name", "avatar_url", "billing_address", "payment_method") VALUES
	('5355d505-8cf5-43c1-aaf3-af4f3eb9c984', 'Ben Gardiner', 'https://avatars.githubusercontent.com/u/38408476?v=4', NULL, NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: applicants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."applicants_id_seq"', 1, false);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."companies_id_seq"', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."jobs_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
