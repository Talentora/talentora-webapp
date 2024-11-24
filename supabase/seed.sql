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
	('00000000-0000-0000-0000-000000000000', '13e3e14d-24a1-4484-8fe6-acd54c68831f', '{"action":"user_signedup","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2024-08-09 21:20:31.075721+00', ''),
	('00000000-0000-0000-0000-000000000000', '71271b1f-e497-4b73-9dab-c8dd7cdd91f4', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:21:24.075572+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f55601b7-05d5-4dcf-8e06-3a60b9690391', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:21:29.18063+00', ''),
	('00000000-0000-0000-0000-000000000000', '91a18c93-33cc-4065-8c45-57d60aa336ed', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:21:42.821957+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4a9cdaa-7082-40a7-b499-ac8b658d8840', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:22:41.310876+00', ''),
	('00000000-0000-0000-0000-000000000000', '4cfa329a-e72f-4c8a-a248-275b92db8e98', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:24:31.864482+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed2b5d34-ac72-474e-b85b-5d57b95e65ef', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:25:49.239492+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cc5ebcb-889e-4828-b28d-e50801dbf5cb', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:26:35.874253+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0d392dc-582d-4924-8883-39db5eece469', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:26:49.295077+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fadff227-b169-4b09-b2f4-4cf854ac47a3', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:32:06.027255+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d5ec744-ea61-4e15-bf7a-d202f5e687aa', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:32:17.938536+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8c2a1b2-0db8-4891-893d-40d635543ea2', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:32:27.672475+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a68c1f1-9718-4583-b24c-91e20253faa1', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:32:31.170953+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6742e99-025e-4bc5-bece-6cc92ba28c0c', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:36:38.844091+00', ''),
	('00000000-0000-0000-0000-000000000000', '97a47d16-a3cb-4ab2-9614-f10cb4cd4fee', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-08-09 21:36:39.388148+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc231f47-5673-4039-85ad-06de05eba9e4', '{"action":"logout","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-08-09 21:50:20.478139+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a12939aa-a086-4b7e-8284-c125c81e4392', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:50:23.979691+00', ''),
	('00000000-0000-0000-0000-000000000000', '8764a10e-0319-4330-9bcd-1100938adf18', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-08-09 21:50:25.215961+00', ''),
	('00000000-0000-0000-0000-000000000000', '07df6d9b-60ad-4c3a-80ee-24ae74439871', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-09 21:50:26.474237+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d21bfb5-edf3-4810-ab48-d68b5e8e10fb', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-08-09 21:50:26.635228+00', ''),
	('00000000-0000-0000-0000-000000000000', '69afe11e-9386-4a1f-83c2-1d4b78633431', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-26 03:42:43.164533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe922c32-4bdd-43c4-929e-316f8fba66a7', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-08-28 23:49:08.956052+00', ''),
	('00000000-0000-0000-0000-000000000000', '92a5ce9c-839e-41ce-8a9b-0ea3d3c09573', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-08-28 23:49:10.061199+00', ''),
	('00000000-0000-0000-0000-000000000000', '029dc9a4-5de9-42ab-be05-6e3e4d228bc8', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:25.424939+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0cda9ee-17d9-4e0e-a6ca-d06b0d257e54', '{"action":"token_revoked","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:25.428818+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ccb817f5-f16e-4c26-97e6-f3ed64ea04b8', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:27.181652+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a592488-4287-472b-a130-fbd565b7d916', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:28.873407+00', ''),
	('00000000-0000-0000-0000-000000000000', '600ef5a5-050a-43cb-95b6-2fbc0839949c', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:28.884353+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f958cd46-bf67-48be-89d7-eac0c0a86091', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:30.07122+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc8cff46-5b9e-4456-b506-e7de03a2fc19', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:30.330942+00', ''),
	('00000000-0000-0000-0000-000000000000', '55dc955f-e42c-4626-a89d-15f8e8ed09b4', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:30.358559+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c86f0bc-2921-41b2-9f51-a56d90f28936', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:31.68949+00', ''),
	('00000000-0000-0000-0000-000000000000', '76cd49e3-7972-4706-933a-192bce008848', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:34.900475+00', ''),
	('00000000-0000-0000-0000-000000000000', '48b9ab98-a6b4-4ba9-80c5-8aeb41c06ea5', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:35.077369+00', ''),
	('00000000-0000-0000-0000-000000000000', '50c68105-31f3-4f85-97de-76b229506a18', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:35.252867+00', ''),
	('00000000-0000-0000-0000-000000000000', '00a4b305-270e-4bbe-b18b-c49afe96da9d', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-09 21:05:35.335394+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f571db8-4689-4b91-a5e9-bc2d7c3a111b', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-10 00:49:40.567482+00', ''),
	('00000000-0000-0000-0000-000000000000', '0bc2c0db-0a98-4db5-9022-5407871dfa79', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-10 00:49:42.087459+00', ''),
	('00000000-0000-0000-0000-000000000000', '53f7a05d-88d2-43f0-9307-f3d99bc357a9', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-10 00:49:42.939966+00', ''),
	('00000000-0000-0000-0000-000000000000', '760e8341-43af-4e18-b610-ced250ed9de5', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-10 00:49:42.963516+00', ''),
	('00000000-0000-0000-0000-000000000000', '05641710-55ae-4ccd-9e9b-f1fe1dc20c61', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-10 00:49:43.951822+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd146432e-3ad1-40bb-8b84-f8a517830e18', '{"action":"token_refreshed","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-09-10 00:49:44.106525+00', ''),
	('00000000-0000-0000-0000-000000000000', '35ed30d4-73c8-410f-ab8e-3899d1981be3', '{"action":"logout","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-09-10 00:49:44.208355+00', ''),
	('00000000-0000-0000-0000-000000000000', '59c4e292-e4d6-4072-8ebb-a7789a3c7d58', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-09-10 00:49:47.512003+00', ''),
	('00000000-0000-0000-0000-000000000000', '15df9534-e353-46b6-a32b-8636b7f99549', '{"action":"login","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-09-10 00:49:48.676735+00', ''),
	('00000000-0000-0000-0000-000000000000', '70ba8965-c855-4dc9-b035-378aed9ba100', '{"action":"logout","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-09-10 00:49:52.219572+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b6e4e77-96e3-4fd0-9216-ac41363ad7cd', '{"action":"user_signedup","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2024-09-21 00:35:54.992727+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db21e862-fe67-4d20-bfbd-7ffa5aff8698', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-09-21 00:35:56.324644+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f446cde-e838-41c3-aa21-7223658ce2b7', '{"action":"user_repeated_signup","actor_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-09-30 01:28:43.607719+00', ''),
	('00000000-0000-0000-0000-000000000000', '103ec850-aad8-4db6-ac5c-784a51434fc6', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bengardiner18@gmail.com","user_id":"74e45d04-5bd5-4849-b363-65cfad890fa2","user_phone":""}}', '2024-09-30 18:42:10.329204+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c67e385-404d-40c2-9cbc-4ae1d3616010', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"asdf@gmail.com","user_id":"afcb16c2-89d8-45c1-a095-4f79c30f4c0f","user_phone":""}}', '2024-10-07 03:40:48.195679+00', ''),
	('00000000-0000-0000-0000-000000000000', '9662ac0c-2cd2-40b2-b0c3-9a0a5fba37e9', '{"action":"user_confirmation_requested","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-11-04 19:06:13.628436+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d8d1349-1819-4876-9a8c-fdefd1ca3158', '{"action":"user_signedup","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"team"}', '2024-11-04 19:06:38.218456+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3b29365-e071-4897-bde9-af599831820a', '{"action":"user_confirmation_requested","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-11-04 19:07:01.286637+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a0242d8-664e-4268-9727-30601bc80ff7', '{"action":"login","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-04 19:07:02.413827+00', ''),
	('00000000-0000-0000-0000-000000000000', '0633c3f5-ad27-41d8-80b7-029e20d4f823', '{"action":"login","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-04 19:07:04.125366+00', ''),
	('00000000-0000-0000-0000-000000000000', '66788763-ecf6-40d2-8698-22ce22acdf25', '{"action":"user_signedup","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-11-04 19:07:36.976204+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cc87f6b-c455-4c2c-a0fb-782ae867fa8f', '{"action":"login","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-04 19:08:01.240589+00', ''),
	('00000000-0000-0000-0000-000000000000', '26fac523-19f6-42ae-b69e-dd988f71869f', '{"action":"user_repeated_signup","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-11-04 20:05:06.31828+00', ''),
	('00000000-0000-0000-0000-000000000000', '5edbaabf-3867-42f7-8728-f90fe1768f26', '{"action":"user_recovery_requested","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-11-04 20:06:05.563482+00', ''),
	('00000000-0000-0000-0000-000000000000', '5795b1cf-7389-47e2-b19c-06db84d08241', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:07:02.687007+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ee0237e-d56a-4bc8-8a03-bcd294734896', '{"action":"token_revoked","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:07:02.687667+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f357a654-9f5b-41bf-9259-8f906d734a48', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-11-04 20:07:18.09505+00', ''),
	('00000000-0000-0000-0000-000000000000', '35aa28e7-46f1-4eb8-b031-e757e3d70bee', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-04 20:10:39.669201+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fae9069-3f7a-411a-a7a4-b6fd4ad16f56', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-11-04 20:11:19.963199+00', ''),
	('00000000-0000-0000-0000-000000000000', '61f49940-97c1-4639-8111-ef8c8339abbd', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-11-04 20:11:21.307004+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa1f3404-cd1d-46f2-b112-d1672914bbe4', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-11-04 20:11:22.005597+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e539f97-632b-43fb-bcf8-00e8d5c24be4', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-11-04 20:11:22.191374+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd20d161d-b493-42c0-b7a8-713d37f09fbd', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-11-04 20:11:22.743357+00', ''),
	('00000000-0000-0000-0000-000000000000', '49be15d7-f993-400e-9f67-cc513d5a8989', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-11-04 20:11:23.059402+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f910e65b-91f8-4c17-867e-c44959e79f3d', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:49.94857+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc3cac6c-b682-4b03-8e60-5d6ab08014b6', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:49.949956+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfb4369a-0ee5-44a3-b0b1-799f17890ac1', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:49.96506+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc9bd816-abe0-483e-851f-93c4e91d70b1', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:50.488139+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ff6ad61-01a2-4107-9648-5471ebcebd3f', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:51.157135+00', ''),
	('00000000-0000-0000-0000-000000000000', '8aea7c61-dd08-4830-ac17-7c45c78d9a65', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:51.301277+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e42a8b9-3348-44e0-a30f-e77d90482d9b', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:51.582309+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da5bf7ff-f84e-4332-8196-dbc17ecf1762', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:51.649938+00', ''),
	('00000000-0000-0000-0000-000000000000', '78f19f00-1e84-43b5-a969-c02f61bc610c', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:52.257381+00', ''),
	('00000000-0000-0000-0000-000000000000', '7186cca2-40b9-4dc3-94d4-a84932849c52', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:52.721414+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6a34e9d-f7fb-45be-b23f-da188f60c093', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:53.086601+00', ''),
	('00000000-0000-0000-0000-000000000000', '3dd0221c-f900-4681-953a-70947c04c909', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:53.239633+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa9eddde-5fb6-4b91-975f-f01e22669b6b', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:53.50918+00', ''),
	('00000000-0000-0000-0000-000000000000', '84610dcc-3e48-44b7-a682-216b1b5a2e7b', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:53.7864+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd461b3dc-4f97-4840-b76e-233df11c2e2d', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 20:28:54.065333+00', ''),
	('00000000-0000-0000-0000-000000000000', '56d0ca45-f6dc-4a2a-bbee-58ed6e4584d1', '{"action":"login","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-11-04 21:11:54.641244+00', ''),
	('00000000-0000-0000-0000-000000000000', '37308e70-b539-476d-abe1-8d2a9744fe8c', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:11:54.913217+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bab953f0-656c-43d1-b91f-6aaf492555ae', '{"action":"token_revoked","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:11:54.913796+00', ''),
	('00000000-0000-0000-0000-000000000000', '96fa3190-c96a-456f-bdd4-d43d8ba5c40b', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:11:56.154476+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f477a52-dced-4675-8131-9ec1400c9c69', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:11:56.706499+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fadd7a8-5928-4ada-bb8e-ddecd96259f9', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:11:56.717589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2358b53-20c3-4315-bd44-4db27283c238', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:12:25.280849+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e76c1b20-cd7a-4952-967f-51c5e89dfbb7', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:12:25.472064+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a44e56f-f7d2-4e63-af3c-5df823bd5fa5', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:12:25.824771+00', ''),
	('00000000-0000-0000-0000-000000000000', '94e6a0ce-d61b-4837-a8d2-68bb891124b8', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:12:25.844843+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb69db16-332b-4fa7-aa54-c537149e9054', '{"action":"user_confirmation_requested","actor_id":"d44fe8c7-5837-42d5-9b40-5b47601f2526","actor_name":"Ruby Chen","actor_username":"rc071404@bu.edu","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-11-04 21:18:34.683213+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc7bee71-4b81-4123-995f-8fe0ccaef98c', '{"action":"user_confirmation_requested","actor_id":"d44fe8c7-5837-42d5-9b40-5b47601f2526","actor_name":"Ruby Chen","actor_username":"rc071404@bu.edu","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-11-04 21:19:59.437545+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e16253f4-a5cd-455d-823b-898fdfb80620', '{"action":"user_signedup","actor_id":"d44fe8c7-5837-42d5-9b40-5b47601f2526","actor_name":"Ruby Chen","actor_username":"rc071404@bu.edu","actor_via_sso":false,"log_type":"team"}', '2024-11-04 21:20:54.62556+00', ''),
	('00000000-0000-0000-0000-000000000000', '81a36b70-c2e6-4153-962a-816ab89b5540', '{"action":"login","actor_id":"d44fe8c7-5837-42d5-9b40-5b47601f2526","actor_name":"Ruby Chen","actor_username":"rc071404@bu.edu","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-04 21:21:06.19504+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f02676f-b05b-4b93-aa9f-f79d887182e3', '{"action":"logout","actor_id":"d44fe8c7-5837-42d5-9b40-5b47601f2526","actor_name":"Ruby Chen","actor_username":"rc071404@bu.edu","actor_via_sso":false,"log_type":"account"}', '2024-11-04 21:30:26.723378+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a813346-956b-4d84-a02e-859fd1492ae9', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:30:57.493938+00', ''),
	('00000000-0000-0000-0000-000000000000', '05fd0549-8d35-438c-8647-739c60fcb91d', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:30:57.75117+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c990fae7-74fe-4a47-a3ff-3451b3373efa', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:30:58.16789+00', ''),
	('00000000-0000-0000-0000-000000000000', '4aab30fc-4c7f-48b7-a8b9-ff2e1c4638d1', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:30:58.338964+00', ''),
	('00000000-0000-0000-0000-000000000000', '727f4c68-d92c-486b-b1ae-3bfd58670e4e', '{"action":"token_refreshed","actor_id":"0d3eda96-4065-4387-8315-6b552862f1f6","actor_username":"heather.davies253@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:30:58.35429+00', ''),
	('00000000-0000-0000-0000-000000000000', '51b7ef7b-753d-4b72-a4bd-1f3adc775f47', '{"action":"login","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-04 21:37:00.543811+00', ''),
	('00000000-0000-0000-0000-000000000000', '88f301d2-93af-4ef4-92e4-0c89aeda5427', '{"action":"login","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-04 21:37:02.966461+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cbbd8df2-cf6e-488c-9ff2-089093c46900', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:51:02.349241+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3715ad3-f951-4972-923b-facd754a1688', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:51:02.351263+00', ''),
	('00000000-0000-0000-0000-000000000000', '24ea4df1-cc55-49aa-b527-90475d582a14', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:51:02.387265+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e5f58f3-1b82-410f-9fa8-42df17ba94e8', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:51:02.664921+00', ''),
	('00000000-0000-0000-0000-000000000000', '11f7e2cc-30f9-4de6-a407-974b266798de', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:51:02.948691+00', ''),
	('00000000-0000-0000-0000-000000000000', '0255607f-c883-456f-9acc-6a89e65ce775', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 21:51:03.341552+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e76dd8b8-eebd-46a0-a0cb-52caa6f1474f', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 22:35:03.701468+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6ff0f45-0d53-46e1-bca8-b404851a7aad', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 22:35:03.709549+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4b0a914-fc24-4b2a-9c7e-05b5a6d0bdcd', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 22:44:44.923472+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa5b8961-78f6-4c46-958c-86fd9e1eab11', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-04 22:44:44.925448+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ead8117-a605-40de-bf68-cb65426bf6b1', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 03:53:04.578282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5e7063a-b301-4311-90a1-d1bf1a27499c', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 03:53:04.580364+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d0b46c9-399a-4ba0-b0bc-abec555f6a96', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:30.839391+00', ''),
	('00000000-0000-0000-0000-000000000000', '0dcdd219-3be8-427f-95bf-814b590a2675', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:30.854371+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac33ab77-7402-442c-9edc-4bc5591bb192', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:30.919511+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ece1352f-9c09-44c8-9afd-1a480e1fc75c', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:31.745948+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae7194cb-6435-433c-bad2-3458655454f7', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:32.475349+00', ''),
	('00000000-0000-0000-0000-000000000000', '55edabb1-8834-4a6f-81f2-fdd7f5402805', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:32.632253+00', ''),
	('00000000-0000-0000-0000-000000000000', '4ce4b77b-d8c2-48e7-a71c-3f0c84a77e2d', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:33.03625+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f54476cf-e5d4-44d4-aebe-647500517b12', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:33.179589+00', ''),
	('00000000-0000-0000-0000-000000000000', '629c7dc8-d20f-4a73-beeb-032af33b1ff3', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:33.485811+00', ''),
	('00000000-0000-0000-0000-000000000000', '41350727-8be2-48f3-ba97-6dd18ed4f8ff', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:34.187309+00', ''),
	('00000000-0000-0000-0000-000000000000', '368d71cb-260e-4dff-ad38-c7c28291c83e', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:34.495796+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbde01c2-c660-40fa-82d3-2214f20dd45d', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:34.507385+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2a070a3-04c8-429f-b86c-2f4f60a5f91d', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:34.729352+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c145d05-1e19-46ee-a721-a8840c32281e', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:35.107178+00', ''),
	('00000000-0000-0000-0000-000000000000', '62efde58-0448-41fe-ae91-33f06bae3d94', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-10 16:36:35.348146+00', ''),
	('00000000-0000-0000-0000-000000000000', '52b161c3-07b2-4b3e-b696-020d70e351de', '{"action":"logout","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-10 17:17:22.101903+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4d6e659-3dc1-4296-b178-148ded94da9e', '{"action":"login","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-10 17:18:18.784632+00', ''),
	('00000000-0000-0000-0000-000000000000', '22ef4d26-4048-41f6-819a-afde243df555', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:44:57.362896+00', ''),
	('00000000-0000-0000-0000-000000000000', '4537bbb9-58c3-49dc-8d07-9113b1f30c05', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:44:57.378281+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dce7a109-dfa6-44b2-8a36-0b4cb5a113b0', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:44:57.430209+00', ''),
	('00000000-0000-0000-0000-000000000000', '4876d6f8-2ed2-4871-a295-ac92fc61f8c3', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:44:58.112317+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f26f1703-82ab-426e-a828-cee08622ff0e', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:44:58.534788+00', ''),
	('00000000-0000-0000-0000-000000000000', '334af819-0662-4913-9cc5-4d86cdb44122', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:44:59.470659+00', ''),
	('00000000-0000-0000-0000-000000000000', '8571ac62-765d-437d-a120-ec781efc83a9', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:00.190932+00', ''),
	('00000000-0000-0000-0000-000000000000', '76da58c0-d86a-4a52-81be-6c93b43abc57', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:00.214173+00', ''),
	('00000000-0000-0000-0000-000000000000', '2fd1631f-8cff-4242-a371-873d077c8d36', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:00.581916+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d6544b2-9a8f-4f0d-8f44-e4419041cdde', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:00.826367+00', ''),
	('00000000-0000-0000-0000-000000000000', '40ba6821-fb2c-4121-8e08-6eb30ae97a23', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:00.971538+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f94c05ab-667b-4236-88ce-217ff3b220b5', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.011946+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3209a96-30f0-4534-b4d4-0fc4b25e4e2b', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.260214+00', ''),
	('00000000-0000-0000-0000-000000000000', '02da47fd-ceb0-48a9-8daf-9a6027d348fd', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.423712+00', ''),
	('00000000-0000-0000-0000-000000000000', '5979da93-f2d5-4631-843e-9230e8880279', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.440909+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ad7578b-a3d5-42e3-8c2e-1a0ac707dc37', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.778639+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5b1fe35-7804-4399-b3b4-b39ae7aa7693', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.844119+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a8925cc-37e8-4f64-b6e9-3afc21a3cde7', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:01.968805+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0782dac-20cc-4303-978f-692d556a7bd0', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:02.245543+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aed7d95e-a7fd-488b-be6e-5b2e1a9303b0', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:02.262805+00', ''),
	('00000000-0000-0000-0000-000000000000', '1870b3be-f9c1-40af-9347-678f376693aa', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:02.516741+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0669843-946d-4296-9e14-1be49ff46c01', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-11 19:45:02.823639+00', ''),
	('00000000-0000-0000-0000-000000000000', '40e4874b-9ea1-4079-837a-4768f24970f5', '{"action":"login","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-11 21:24:40.754401+00', ''),
	('00000000-0000-0000-0000-000000000000', '5cfcdf70-c2b7-4cf8-b82c-9fc0561af7df', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:26.881032+00', ''),
	('00000000-0000-0000-0000-000000000000', '803ad473-508c-4d81-903a-158dcf12a893', '{"action":"token_revoked","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:26.886251+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea56f339-81b6-457c-ae28-b87e759919fc', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:26.949749+00', ''),
	('00000000-0000-0000-0000-000000000000', '316148eb-aef7-4436-8403-73756d0aa27a', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:27.391956+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc9e20fc-7e3b-4012-8cb3-647e85e166cf', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:28.035842+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6e2aa5b-92ef-41e3-881b-00338fd7cc25', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:28.052771+00', ''),
	('00000000-0000-0000-0000-000000000000', '639f7e9b-6a58-401c-a9a9-41b41a8be2a3', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:28.302482+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a537895-7568-445a-b2c3-759dc90e90b8', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:28.57446+00', ''),
	('00000000-0000-0000-0000-000000000000', '57d70428-7578-44af-8605-a4117f6bfe02', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:28.665666+00', ''),
	('00000000-0000-0000-0000-000000000000', '1becb3b6-b45c-44fb-ae37-bbbd86eec269', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:28.99195+00', ''),
	('00000000-0000-0000-0000-000000000000', '6dc5aeef-d0a4-42d8-a796-ae62f4d8fdb6', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:29.000316+00', ''),
	('00000000-0000-0000-0000-000000000000', '9133ca4a-bd95-443b-9985-9d5eeaeab0ba', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:29.273333+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c4276a4-9280-4544-a086-3a801c0484a8', '{"action":"token_refreshed","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"token"}', '2024-11-11 21:40:29.506446+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a317c36-28fc-4435-bc4a-db8d4de190d2', '{"action":"logout","actor_id":"f80b08b2-0d06-4784-91b3-90cae385dcfe","actor_name":"Lucas Yoon","actor_username":"lyoon02@bu.edu","actor_via_sso":false,"log_type":"account"}', '2024-11-11 22:10:19.442394+00', ''),
	('00000000-0000-0000-0000-000000000000', '94d1b9ab-8d88-4fe6-b63b-464b546af912', '{"action":"login","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-11 22:10:40.160212+00', ''),
	('00000000-0000-0000-0000-000000000000', '2454b6b6-dea4-407c-9cee-a33e63fb6e5e', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 00:11:19.435109+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2a13dd1-2392-45f7-b3a7-e7a4d7379679', '{"action":"token_revoked","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 00:11:19.440059+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a8ec1b5-54d2-4245-b8ab-71e840763997', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 00:11:21.0984+00', ''),
	('00000000-0000-0000-0000-000000000000', '91f510c4-6412-47c7-8a5c-32ef4bfd491f', '{"action":"token_refreshed","actor_id":"b5e3c27d-7d54-4949-bea1-f777ff8fc460","actor_name":"Ben Gardiner","actor_username":"bengardiner18@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 00:11:21.113833+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('28d07527-0eff-4e34-a145-4d36b3d32027', '74e45d04-5bd5-4849-b363-65cfad890fa2', '12732439-287e-444e-9e5e-ca7c11f8d8df', 's256', 'gv-teJJl2wUETztlqU8utZxCIacKqyIbJUQ1JfgIiLA', 'github', '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', '', '2024-08-09 21:20:28.092378+00', '2024-08-09 21:20:31.080895+00', 'oauth', '2024-08-09 21:20:31.08084+00'),
	('fafbd65d-4475-42fd-8192-c33208d87a1c', '74e45d04-5bd5-4849-b363-65cfad890fa2', 'ed4077ce-596b-4e54-aa0c-4ec647b19110', 's256', 'NDKBFSegsztkIAvzNOAvUt4mqYqrSThj2gmal7KGs44', 'github', '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', '', '2024-08-09 21:21:23.459526+00', '2024-08-09 21:21:24.076603+00', 'oauth', '2024-08-09 21:21:24.076556+00'),
	('743010ae-4180-42b6-b8f9-cfff628b7f8d', '74e45d04-5bd5-4849-b363-65cfad890fa2', '92b1ad67-0072-4572-bb75-579ab05226a2', 's256', '19QxWSyglcjJMYVFIzIzIoUN6G_djhBPaPw2iVvQU0I', 'github', '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', '', '2024-08-09 21:21:28.664388+00', '2024-08-09 21:21:29.181188+00', 'oauth', '2024-08-09 21:21:29.181147+00'),
	('1232e486-029b-41bf-9bd7-82b8317ad204', '74e45d04-5bd5-4849-b363-65cfad890fa2', '0ed52c8b-2dd8-4c5b-9dfa-9a362f2b4778', 's256', 'GuUtvPrAL1OzxaSKY9JYYlksXkLYkLDR9p7ToUc9B30', 'github', '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', '', '2024-08-09 21:21:42.307267+00', '2024-08-09 21:21:42.822584+00', 'oauth', '2024-08-09 21:21:42.822532+00'),
	('312f11a4-6e2a-4750-90ce-e60bd070e22c', '74e45d04-5bd5-4849-b363-65cfad890fa2', 'ccb8cd97-dcf4-4241-a64c-ea260459463f', 's256', 'FhMjCA8MeBXx8MrWF3DMXIFof-AoB_giq3gFjhzWpto', 'github', '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', '', '2024-08-09 21:22:40.718392+00', '2024-08-09 21:22:41.312277+00', 'oauth', '2024-08-09 21:22:41.312228+00'),
	('9b9c108c-1b5c-40a1-aab2-931020a52374', '74e45d04-5bd5-4849-b363-65cfad890fa2', '6f3bf812-384e-46f7-987b-35a2c0c615dc', 's256', 'M3vg7BLc6hC1iqajQiT9ElTn8rtS2XxqmLZ-5a8-_KU', 'github', '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', '', '2024-08-09 21:24:31.25673+00', '2024-08-09 21:24:31.866329+00', 'oauth', '2024-08-09 21:24:31.866281+00'),
	('f324cf92-4f05-4480-92a0-5ee517725c25', '74e45d04-5bd5-4849-b363-65cfad890fa2', 'b44e70dc-7a72-4d2b-a0e2-1328d38f330c', 's256', 's-oq1P-J1Bpik-tkWy-i6xk1DCAiqiNKFF5nnhESgn4', 'github', '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', '', '2024-08-09 21:25:48.670305+00', '2024-08-09 21:25:49.240374+00', 'oauth', '2024-08-09 21:25:49.240331+00'),
	('ab5788c3-8735-4443-a28f-80aefc69ebb3', '74e45d04-5bd5-4849-b363-65cfad890fa2', 'cb15107e-51e9-4255-a36d-5f2289458337', 's256', 'kpTA1_-c3grz3g6gQg9hs6LNYFrinFKfqBMvyCRIZaM', 'github', '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', '', '2024-08-09 21:26:35.299803+00', '2024-08-09 21:26:35.874887+00', 'oauth', '2024-08-09 21:26:35.87484+00'),
	('ad5b7666-4ee7-4010-a889-ea94c86b2db2', '74e45d04-5bd5-4849-b363-65cfad890fa2', '287bfa3a-248f-4c67-bea7-c6e43a15a442', 's256', 'KADnNbUgcqKDX1IX6l41KKrJl7BkI6eozYIKlD73ut8', 'github', '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', '', '2024-08-09 21:26:48.702061+00', '2024-08-09 21:26:49.295679+00', 'oauth', '2024-08-09 21:26:49.295636+00'),
	('349c74a1-7a3d-4488-b996-7b6d4f0376ac', '74e45d04-5bd5-4849-b363-65cfad890fa2', 'ecf5f069-e5ca-4e51-9f98-8c03f6fca210', 's256', '5oD31egFxvb9clKFf-tUrNcz6Q7p9-PQlvT7yeL_umc', 'github', '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', '', '2024-08-09 21:32:05.44691+00', '2024-08-09 21:32:06.03249+00', 'oauth', '2024-08-09 21:32:06.032418+00'),
	('f503d927-6e6c-4701-b68b-f6075b36603c', '74e45d04-5bd5-4849-b363-65cfad890fa2', '3713be18-1476-496b-b0c0-3fb66609bc5e', 's256', 'uLoKwzhHVphn3Jj0Ll9msu2zEZ2bLZl4ZMUsC8IzS5U', 'github', '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', '', '2024-08-09 21:32:13.315398+00', '2024-08-09 21:32:17.939197+00', 'oauth', '2024-08-09 21:32:17.939155+00'),
	('cf26fd96-e52b-4ea4-8347-077c14a8c566', '74e45d04-5bd5-4849-b363-65cfad890fa2', '980d72b8-91c8-47dc-8da6-7c2af3cc6e11', 's256', 'yrWxozg9Twx6Uw6LtI_8RnTO9_fRCU5-JzWT0jGzvao', 'github', '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', '', '2024-08-09 21:32:27.145596+00', '2024-08-09 21:32:27.673065+00', 'oauth', '2024-08-09 21:32:27.673016+00'),
	('74f1771c-6590-414a-bba0-3354fb0b6bba', '74e45d04-5bd5-4849-b363-65cfad890fa2', '3eac0090-878e-4402-a336-d3b295726cb0', 's256', 'lGpVept2mCKspgbjjxXzGlnOlWYWal68myUOlc12UQQ', 'github', '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', '', '2024-08-09 21:32:30.575176+00', '2024-08-09 21:32:31.171679+00', 'oauth', '2024-08-09 21:32:31.17163+00'),
	('c8b8784a-61b4-44b5-a2a7-2df83d7e6c0a', '74e45d04-5bd5-4849-b363-65cfad890fa2', '17ebb9d9-48cb-4251-bd3b-bf76a8aa1ea5', 's256', 'oyru_IFQUqTJVWGZ9D284xi41Of403peLQQG3v3qNgQ', 'github', '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', '', '2024-08-26 03:42:42.322348+00', '2024-08-26 03:42:43.171777+00', 'oauth', '2024-08-26 03:42:43.171714+00'),
	('a14ce19f-2bf9-4ea8-8712-0a6131593488', 'f80b08b2-0d06-4784-91b3-90cae385dcfe', 'a4dec2bc-ba62-4afd-bd7b-eda77fc2ed6c', 's256', 'keUCJPNj8lClTydvcrTZEjOQWX6eNJEq5XyeC2OOwg8', 'email', '', '', '2024-11-04 19:06:13.629741+00', '2024-11-04 19:06:38.223886+00', 'email/signup', '2024-11-04 19:06:38.223843+00'),
	('2a08c0d5-8d88-472b-a447-1b684cfad435', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', '2bb0d7a6-c255-41ff-8c48-cca4d398cbc6', 's256', 'Lf8HI1v80jicpTswXqJjkCbeOIUAT0lujjl3Kfo8AXU', 'email', '', '', '2024-11-04 19:07:01.287195+00', '2024-11-04 19:07:36.979825+00', 'email/signup', '2024-11-04 19:07:36.979787+00'),
	('cd0b43cf-748f-4e91-9dd8-67ac7691999e', '0d3eda96-4065-4387-8315-6b552862f1f6', 'dfaa5258-96a4-4df2-8d95-c53c8fa603f7', 's256', 'A6KfKva1iK0MH6hEHTROIEzyn0N2NDIWYEZsVtY8KCE', 'github', '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', '', '2024-11-04 20:07:17.458426+00', '2024-11-04 20:07:18.095667+00', 'oauth', '2024-11-04 20:07:18.095601+00'),
	('fc3f3630-a1a3-4e01-aa86-706439cdc8e8', '0d3eda96-4065-4387-8315-6b552862f1f6', '70c43bbd-8178-4715-a6fd-6254a9c1c478', 's256', 'YbhjIQVeg3Tb9c1_cu5HfavXUYziCYonsXIhI-VLwds', 'recovery', '', '', '2024-11-04 20:06:05.55975+00', '2024-11-04 20:10:39.674373+00', 'recovery', '2024-11-04 20:10:39.674335+00'),
	('9d50c733-ee9f-4571-9877-927dc18b4085', NULL, 'c24b8721-d8a9-43e0-99d6-fdc6c354291d', 's256', 'w3sser5uk9LGPmgPs2FU9Icf4GysqG3nnX5YS6gZAME', 'github', '', '', '2024-11-04 20:11:21.26788+00', '2024-11-04 20:11:21.26788+00', 'oauth', NULL),
	('6596af5a-b103-4efd-b977-6993668b557d', '0d3eda96-4065-4387-8315-6b552862f1f6', '8f0af5f0-9ce8-42a3-8fec-5a6f2cf6f711', 's256', 'RhPO_WGPR6XIHmO6hn9O-daPN6xNzSx0zgofidDYnaM', 'github', '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', '', '2024-11-04 21:11:54.047927+00', '2024-11-04 21:11:54.642739+00', 'oauth', '2024-11-04 21:11:54.642699+00'),
	('c13f254b-07e6-4305-94c7-3a0a1464b2cd', 'd44fe8c7-5837-42d5-9b40-5b47601f2526', 'd315b8e6-076d-4234-a9d2-add7594e7a64', 's256', 'faVxBVJOWNBL1c8BqgX99Ufe7NryqpPJtl6zb5eIzpY', 'email', '', '', '2024-11-04 21:18:34.684583+00', '2024-11-04 21:18:34.684583+00', 'email/signup', NULL),
	('5e065db0-2d7c-4f27-a1c9-ed741619e027', 'd44fe8c7-5837-42d5-9b40-5b47601f2526', 'ac907001-cc92-417e-986a-811196f7a11e', 's256', 'XDqEcjKZ9s1ITlYenhBA_Tlv-lD79fhPkZdkklb1pkk', 'email', '', '', '2024-11-04 21:19:59.438244+00', '2024-11-04 21:20:54.630221+00', 'email/signup', '2024-11-04 21:20:54.630185+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'afcb16c2-89d8-45c1-a095-4f79c30f4c0f', 'authenticated', 'authenticated', 'asdf@gmail.com', '$2a$10$rwW3zI6CKtWWu8/a46Zfn./tkH51RL2kRPrQDS6oWTIYpemTCAc1O', '2024-10-07 03:40:48.205269+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-07 03:40:48.181277+00', '2024-10-07 03:40:48.205524+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0d3eda96-4065-4387-8315-6b552862f1f6', 'authenticated', 'authenticated', 'heather.davies253@gmail.com', NULL, '2024-09-21 00:35:54.999619+00', NULL, '', NULL, '', '2024-11-04 20:06:05.564007+00', '', '', NULL, '2024-11-04 20:11:23.060412+00', '{"provider": "github", "providers": ["github"]}', '{"iss": "https://api.github.com", "sub": "26665300", "email": "heather.davies253@gmail.com", "user_name": "heather2535", "avatar_url": "https://avatars.githubusercontent.com/u/26665300?v=4", "provider_id": "26665300", "email_verified": true, "phone_verified": false, "preferred_username": "heather2535"}', NULL, '2024-09-21 00:35:54.97124+00', '2024-11-04 21:11:54.916578+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd44fe8c7-5837-42d5-9b40-5b47601f2526', 'authenticated', 'authenticated', 'rc071404@bu.edu', '$2a$10$U40HmX.KUYZbClY9Qmecjem7XbzFUwGaqgTH8FoTpTwEyyoyZng5G', '2024-11-04 21:20:54.626176+00', NULL, '', '2024-11-04 21:19:59.438781+00', '', NULL, '', '', NULL, '2024-11-04 21:21:06.195796+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d44fe8c7-5837-42d5-9b40-5b47601f2526", "role": "applicant", "email": "rc071404@bu.edu", "full_name": "Ruby Chen", "email_verified": false, "phone_verified": false}', NULL, '2024-11-04 21:18:34.674472+00', '2024-11-04 21:21:06.200043+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f80b08b2-0d06-4784-91b3-90cae385dcfe', 'authenticated', 'authenticated', 'lyoon02@bu.edu', '$2a$10$vjhB.jeWcx6xc25z7y33LevLIQ4r2NzfBoynIYXlgn1.N906bhjDm', '2024-11-04 19:06:38.219058+00', NULL, '', '2024-11-04 19:06:13.631696+00', '', NULL, '', '', NULL, '2024-11-04 19:07:04.126175+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "f80b08b2-0d06-4784-91b3-90cae385dcfe", "role": "recruiter", "email": "lyoon02@bu.edu", "full_name": "Lucas Yoon", "email_verified": false, "phone_verified": false}', NULL, '2024-11-04 19:06:13.613508+00', '2024-11-11 21:40:26.891269+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', 'authenticated', 'authenticated', 'bengardiner18@gmail.com', '$2a$10$8lRM2wJMqfMhOyC.yTx.PeRThDlbz2cbWDiSFbPtwuO3MfOowTPAC', '2024-11-04 19:07:36.976801+00', NULL, '', '2024-11-04 19:07:01.287739+00', '', NULL, '', '', NULL, '2024-11-11 22:10:40.160884+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b5e3c27d-7d54-4949-bea1-f777ff8fc460", "role": "recruiter", "email": "bengardiner18@gmail.com", "full_name": "Ben Gardiner", "email_verified": false, "phone_verified": false}', NULL, '2024-11-04 19:07:01.280663+00', '2024-11-12 00:11:19.44664+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('afcb16c2-89d8-45c1-a095-4f79c30f4c0f', 'afcb16c2-89d8-45c1-a095-4f79c30f4c0f', '{"sub": "afcb16c2-89d8-45c1-a095-4f79c30f4c0f", "email": "asdf@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-07 03:40:48.189137+00', '2024-10-07 03:40:48.189762+00', '2024-10-07 03:40:48.189762+00', 'ba45a73b-c016-4425-bca9-034fcfc31d46'),
	('f80b08b2-0d06-4784-91b3-90cae385dcfe', 'f80b08b2-0d06-4784-91b3-90cae385dcfe', '{"sub": "f80b08b2-0d06-4784-91b3-90cae385dcfe", "role": "recruiter", "email": "lyoon02@bu.edu", "full_name": "Lucas Yoon", "email_verified": false, "phone_verified": false}', 'email', '2024-11-04 19:06:13.624592+00', '2024-11-04 19:06:13.624638+00', '2024-11-04 19:06:13.624638+00', 'a114d6df-cf88-4753-b59b-fec9eedf255b'),
	('b5e3c27d-7d54-4949-bea1-f777ff8fc460', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', '{"sub": "b5e3c27d-7d54-4949-bea1-f777ff8fc460", "role": "recruiter", "email": "bengardiner18@gmail.com", "full_name": "Ben Gardiner", "email_verified": false, "phone_verified": false}', 'email', '2024-11-04 19:07:01.283071+00', '2024-11-04 19:07:01.283119+00', '2024-11-04 19:07:01.283119+00', '05cdc6e6-de3f-44f4-bc97-1a9f43a789ae'),
	('26665300', '0d3eda96-4065-4387-8315-6b552862f1f6', '{"iss": "https://api.github.com", "sub": "26665300", "email": "heather.davies253@gmail.com", "user_name": "heather2535", "avatar_url": "https://avatars.githubusercontent.com/u/26665300?v=4", "provider_id": "26665300", "email_verified": true, "phone_verified": false, "preferred_username": "heather2535"}', 'github', '2024-09-21 00:35:54.986191+00', '2024-09-21 00:35:54.98624+00', '2024-11-04 21:11:54.637913+00', '0c913ed6-f933-4457-a3e2-d01d54742746'),
	('d44fe8c7-5837-42d5-9b40-5b47601f2526', 'd44fe8c7-5837-42d5-9b40-5b47601f2526', '{"sub": "d44fe8c7-5837-42d5-9b40-5b47601f2526", "role": "applicant", "email": "rc071404@bu.edu", "full_name": "Ruby Chen", "email_verified": false, "phone_verified": false}', 'email', '2024-11-04 21:18:34.680161+00', '2024-11-04 21:18:34.680212+00', '2024-11-04 21:18:34.680212+00', '498f464c-ccaf-49e5-96f8-d11fcf68bebf');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('176bb1c6-2c53-4a98-9c67-8b98ccc99eb1', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', '2024-11-11 21:24:40.769033+00', '2024-11-11 21:24:40.769033+00', NULL, 'aal1', NULL, NULL, 'node', '35.247.111.203', NULL),
	('ae627b5f-6fde-4bfb-b6a4-13afc36b9f9a', '0d3eda96-4065-4387-8315-6b552862f1f6', '2024-11-04 20:11:23.060479+00', '2024-11-04 21:30:58.355477+00', NULL, 'aal1', NULL, '2024-11-04 21:30:58.355407', 'Vercel Edge Functions', '2a06:98c0:3600::103', NULL),
	('356bb57b-6ca5-40d0-a4d4-752462155bcf', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', '2024-11-11 22:10:40.161415+00', '2024-11-12 00:11:21.115217+00', NULL, 'aal1', NULL, '2024-11-12 00:11:21.115147', 'Next.js Middleware', '35.247.111.203', NULL),
	('9e163b40-db97-4dd2-accc-c22a990547cc', '0d3eda96-4065-4387-8315-6b552862f1f6', '2024-09-21 00:35:56.32679+00', '2024-09-21 00:35:56.32679+00', NULL, 'aal1', NULL, NULL, 'node', '3.236.126.187', NULL),
	('cc0dea10-e768-40e3-8621-76d28b9d50ca', '0d3eda96-4065-4387-8315-6b552862f1f6', '2024-11-04 20:11:21.307767+00', '2024-11-04 20:11:21.307767+00', NULL, 'aal1', NULL, NULL, 'node', '18.212.188.97', NULL),
	('9bf312b0-3878-427b-ad9e-ab44a88eb529', '0d3eda96-4065-4387-8315-6b552862f1f6', '2024-11-04 20:11:22.192063+00', '2024-11-04 20:11:22.192063+00', NULL, 'aal1', NULL, NULL, 'node', '18.212.188.97', NULL),
	('6f17180c-2677-4863-a0ee-562a841e75f2', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', '2024-11-10 17:18:18.785374+00', '2024-11-11 19:45:02.824819+00', NULL, 'aal1', NULL, '2024-11-11 19:45:02.824743', 'node', '35.247.111.203', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('9e163b40-db97-4dd2-accc-c22a990547cc', '2024-09-21 00:35:56.353275+00', '2024-09-21 00:35:56.353275+00', 'oauth', '8ecfa334-74fb-4f22-a818-2504473dab2b'),
	('cc0dea10-e768-40e3-8621-76d28b9d50ca', '2024-11-04 20:11:21.311956+00', '2024-11-04 20:11:21.311956+00', 'oauth', '178b0d59-5bb8-4c1a-a9c0-5c2bbc343eb8'),
	('9bf312b0-3878-427b-ad9e-ab44a88eb529', '2024-11-04 20:11:22.193976+00', '2024-11-04 20:11:22.193976+00', 'oauth', '38330886-3827-4c9c-9ef4-8dcdd1ad4039'),
	('ae627b5f-6fde-4bfb-b6a4-13afc36b9f9a', '2024-11-04 20:11:23.062376+00', '2024-11-04 20:11:23.062376+00', 'oauth', '4aaf00d0-cfaf-4fcb-9b08-04e40fd77262'),
	('6f17180c-2677-4863-a0ee-562a841e75f2', '2024-11-10 17:18:18.795629+00', '2024-11-10 17:18:18.795629+00', 'password', '59e86474-c088-45cc-be0d-5af349ca9ddd'),
	('176bb1c6-2c53-4a98-9c67-8b98ccc99eb1', '2024-11-11 21:24:40.778775+00', '2024-11-11 21:24:40.778775+00', 'password', '703db3c1-446b-404d-9906-02c3b41381ef'),
	('356bb57b-6ca5-40d0-a4d4-752462155bcf', '2024-11-11 22:10:40.167885+00', '2024-11-11 22:10:40.167885+00', 'password', '3538f878-4acf-4560-a6c0-8112b14a1075');


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
	('00000000-0000-0000-0000-000000000000', 7, '_dVt3drwWvWCG1yce3yMTw', '0d3eda96-4065-4387-8315-6b552862f1f6', false, '2024-09-21 00:35:56.332729+00', '2024-09-21 00:35:56.332729+00', NULL, '9e163b40-db97-4dd2-accc-c22a990547cc'),
	('00000000-0000-0000-0000-000000000000', 12, 'YSlSSaZ8m_mQ6GVj_aykxw', '0d3eda96-4065-4387-8315-6b552862f1f6', false, '2024-11-04 20:11:21.308962+00', '2024-11-04 20:11:21.308962+00', NULL, 'cc0dea10-e768-40e3-8621-76d28b9d50ca'),
	('00000000-0000-0000-0000-000000000000', 13, 'ZKd53dae2zVgKkV_Vzosng', '0d3eda96-4065-4387-8315-6b552862f1f6', false, '2024-11-04 20:11:22.192785+00', '2024-11-04 20:11:22.192785+00', NULL, '9bf312b0-3878-427b-ad9e-ab44a88eb529'),
	('00000000-0000-0000-0000-000000000000', 14, 'mfxLyiVO_wl4TM4JlAKwDg', '0d3eda96-4065-4387-8315-6b552862f1f6', true, '2024-11-04 20:11:23.061152+00', '2024-11-04 21:11:54.914261+00', NULL, 'ae627b5f-6fde-4bfb-b6a4-13afc36b9f9a'),
	('00000000-0000-0000-0000-000000000000', 16, 'IphOQ_ZGzOA1Sb9tJuTchQ', '0d3eda96-4065-4387-8315-6b552862f1f6', false, '2024-11-04 21:11:54.915584+00', '2024-11-04 21:11:54.915584+00', 'mfxLyiVO_wl4TM4JlAKwDg', 'ae627b5f-6fde-4bfb-b6a4-13afc36b9f9a'),
	('00000000-0000-0000-0000-000000000000', 25, 'Vl-Y5c9bJVA8YJ73UDRx7g', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', true, '2024-11-10 17:18:18.790785+00', '2024-11-11 19:44:57.378893+00', NULL, '6f17180c-2677-4863-a0ee-562a841e75f2'),
	('00000000-0000-0000-0000-000000000000', 26, 'IdgDAnJhaVA6kA1Mh0qgSw', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', false, '2024-11-11 19:44:57.392927+00', '2024-11-11 19:44:57.392927+00', 'Vl-Y5c9bJVA8YJ73UDRx7g', '6f17180c-2677-4863-a0ee-562a841e75f2'),
	('00000000-0000-0000-0000-000000000000', 27, '2wwJr85pK9yginK663HubA', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', false, '2024-11-11 21:24:40.774795+00', '2024-11-11 21:24:40.774795+00', NULL, '176bb1c6-2c53-4a98-9c67-8b98ccc99eb1'),
	('00000000-0000-0000-0000-000000000000', 29, 'KOUBd5t3-fi2c563bI9z-g', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', true, '2024-11-11 22:10:40.165276+00', '2024-11-12 00:11:19.440608+00', NULL, '356bb57b-6ca5-40d0-a4d4-752462155bcf'),
	('00000000-0000-0000-0000-000000000000', 30, 'ucWFS7DcRelogtjEVNAZuQ', 'b5e3c27d-7d54-4949-bea1-f777ff8fc460', false, '2024-11-12 00:11:19.443613+00', '2024-11-12 00:11:19.443613+00', 'KOUBd5t3-fi2c563bI9z-g', '356bb57b-6ca5-40d0-a4d4-752462155bcf');


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
-- Data for Name: AI_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: applicants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applicants" ("id", "harvest_applicants") VALUES
	('d44fe8c7-5837-42d5-9b40-5b47601f2526', NULL);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "active", "name", "description", "image", "metadata") VALUES
	('prod_QdGcNzk0cF4ZQ4', false, 'Automated Screening', NULL, NULL, '{}'),
	('prod_QdGfm2HFPWfh3e', false, 'Testing', NULL, NULL, '{}'),
	('prod_QdI5aNZgSRgI3k', true, 'Testing', NULL, NULL, '{}');


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prices" ("id", "product_id", "active", "description", "unit_amount", "currency", "type", "interval", "interval_count", "trial_period_days", "metadata") VALUES
	('price_1Pm083AiO04xLtVAWolLG5YX', 'prod_QdGfm2HFPWfh3e', true, NULL, 10000, 'usd', 'recurring', 'month', 1, 0, NULL),
	('price_1Pm04wAiO04xLtVAL0ZlhBXm', 'prod_QdGcNzk0cF4ZQ4', true, NULL, NULL, 'usd', 'recurring', 'month', 1, 0, NULL),
	('price_1Pm1UvAiO04xLtVA2yreHwj5', 'prod_QdI5aNZgSRgI3k', true, NULL, 10000, 'usd', 'recurring', 'month', 1, 0, NULL);


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."companies" ("name", "location", "industry", "description", "email_extension", "website_url", "id", "subscription_id", "billing_address", "merge_account_token", "payment_method") OVERRIDING SYSTEM VALUE VALUES
	('Lydia ', 'boston', 'tech', NULL, NULL, NULL, 'f7422242-7580-4b7f-85c7-bde123c5187c', NULL, NULL, 'g6idwsqSM-sMweHpXBGsYdloT7A0DrRvcabJ0f6Aw-yp2MrofKRaMA', NULL),
	('asdf', 'asdf', 'asdf', NULL, NULL, NULL, '1d60423c-701f-4b88-bcde-6a5f798136c0', NULL, NULL, NULL, NULL),
	('asdf', 'asdf', 'asdf', NULL, NULL, NULL, 'c3a3bc46-7d95-4f36-8833-d2d36f87f056', NULL, NULL, 'mGH0vf6c0jQaJf4cCpqY_0Uz3_ofBexnXDbAn1CoTcKfPmGId-4NHQ', NULL);


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."jobs" ("company_id", "merge_id") VALUES
	(NULL, '1d503eab-bb1c-4c46-99c1-17d576724e73');


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bots; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bots" ("id", "created_at", "name", "voice_id", "description", "prompt", "company_id", "icon", "role") VALUES
	(1, '2024-11-04 20:39:13.499977+00', 'Alice', '21m00Tcm4TlvDq8ikWAM', 'technical recruiter who specializes in hiring DevOps engineers', 'Ask questions about CI/CD pipelines and infrastructure as code', 'f7422242-7580-4b7f-85c7-bde123c5187c', 'Bot', 'Technical Recruiter'),
	(2, '2024-11-04 22:09:04.771067+00', 'nolan', 'AZnzlk1XvdvUeBnXmlld', 'recruiter for quant finance ', 'hi nolan i am a bot ', 'f7422242-7580-4b7f-85c7-bde123c5187c', 'Brain', 'tech recruiter '),
	(3, '2024-11-04 22:10:01.011116+00', 'aa', '21m00Tcm4TlvDq8ikWAM', 'aa', 'aa', 'f7422242-7580-4b7f-85c7-bde123c5187c', 'Bot', 'aa'),
	(4, '2024-11-04 22:29:32.615585+00', 'Lydia''s Bot', 'MF3mGyEYCl7XYWbV9V6O', 'tests finance knowledge', 'test', 'f7422242-7580-4b7f-85c7-bde123c5187c', 'Monitor', 'Finance Analyst');


--
-- Data for Name: company_context; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."company_context" ("id", "created_at", "description", "culture", "goals", "history", "products", "customers") VALUES
	('f7422242-7580-4b7f-85c7-bde123c5187c', '2024-11-04 19:37:04.346289+00', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.'),
	('c3a3bc46-7d95-4f36-8833-d2d36f87f056', '2024-11-11 22:03:36.805948+00', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "stripe_customer_id") VALUES
	('0d3eda96-4065-4387-8315-6b552862f1f6', 'cus_R9qJxqTrMntlUy');


--
-- Data for Name: job_interview_config; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: recruiters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."recruiters" ("id", "avatar_url", "billing_address", "payment_method", "company_id", "harvest_recruiters") VALUES
	('b5e3c27d-7d54-4949-bea1-f777ff8fc460', NULL, NULL, NULL, 'f7422242-7580-4b7f-85c7-bde123c5187c', NULL),
	('f80b08b2-0d06-4784-91b3-90cae385dcfe', NULL, NULL, NULL, 'c3a3bc46-7d95-4f36-8833-d2d36f87f056', NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('Interviews', 'Interviews', NULL, '2024-08-14 21:31:13.400571+00', '2024-08-14 21:31:13.400571+00', false, false, NULL, NULL, NULL),
	('Resumes', 'Resumes', NULL, '2024-10-10 05:14:10.554591+00', '2024-10-10 05:14:10.554591+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('e502db4c-3636-4c27-9400-8ada09769a14', 'Resumes', 'alex_resume', NULL, '2024-10-10 05:18:17.813273+00', '2024-10-10 05:18:17.813273+00', '2024-10-10 05:18:17.813273+00', '{"eTag": "\"54231afee72d9c5513cbfc588a5a6e03-1\"", "size": 40565, "mimetype": "binary/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-10-10T05:18:18.000Z", "contentLength": 40565, "httpStatusCode": 200}', '33ad92ce-301b-43bd-9b41-9106e2ef5978', NULL, NULL),
	('737cf6fc-d8dd-411f-a434-773e75f257c5', 'Interviews', 'example_interview.mp4', NULL, '2024-10-15 19:47:41.870848+00', '2024-10-15 19:47:56.716329+00', '2024-10-15 19:47:41.870848+00', '{"eTag": "\"d13060fcf18dae6f95a19855af09d216\"", "size": 47019740, "mimetype": "video/mp4", "cacheControl": "max-age=3600", "lastModified": "2024-10-15T19:47:56.000Z", "contentLength": 47019740, "httpStatusCode": 200}', '17ac019c-d001-4f20-8748-d53bfe7bc505', NULL, NULL);


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 30, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: bots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."bots_id_seq"', 4, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
