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
	('00000000-0000-0000-0000-000000000000', 'a462df31-0869-451a-9692-fe516dba6ea7', '{"action":"user_signedup","actor_id":"1b71e29e-23a4-4794-afe1-1a50e6caa2a9","actor_username":"1234asdf@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-15 20:45:00.03866+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0900848-5faf-4e5d-8762-68dac4ab68dc', '{"action":"login","actor_id":"1b71e29e-23a4-4794-afe1-1a50e6caa2a9","actor_username":"1234asdf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-15 20:45:00.048657+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd028761d-2e6e-4392-8dd5-4b70f67d644c', '{"action":"logout","actor_id":"1b71e29e-23a4-4794-afe1-1a50e6caa2a9","actor_username":"1234asdf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-15 21:17:54.39095+00', ''),
	('00000000-0000-0000-0000-000000000000', '4516e947-dfef-49a0-931d-4c99ec9662ef', '{"action":"user_signedup","actor_id":"6d4772b5-301b-4a82-ac67-7472d811b359","actor_username":"jddoe@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 01:33:25.325642+00', ''),
	('00000000-0000-0000-0000-000000000000', 'efbe10b0-b681-4e13-846c-d506c2312047', '{"action":"login","actor_id":"6d4772b5-301b-4a82-ac67-7472d811b359","actor_username":"jddoe@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 01:33:25.336194+00', ''),
	('00000000-0000-0000-0000-000000000000', '90eba7f4-c912-4c83-b15c-6f635f941ccd', '{"action":"user_repeated_signup","actor_id":"6d4772b5-301b-4a82-ac67-7472d811b359","actor_username":"jddoe@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-16 01:33:28.296868+00', ''),
	('00000000-0000-0000-0000-000000000000', '6808daed-72b0-47d4-bce8-6c283ab00381', '{"action":"logout","actor_id":"6d4772b5-301b-4a82-ac67-7472d811b359","actor_username":"jddoe@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-16 01:33:33.067559+00', ''),
	('00000000-0000-0000-0000-000000000000', '36369ea0-173f-4f31-8006-d061803a584d', '{"action":"user_signedup","actor_id":"891baa4e-c02d-467f-848d-4bb81e995ad2","actor_username":"hjm@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 02:16:49.454925+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc461067-c046-408c-9d60-fb317c152256', '{"action":"login","actor_id":"891baa4e-c02d-467f-848d-4bb81e995ad2","actor_username":"hjm@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 02:16:49.459469+00', ''),
	('00000000-0000-0000-0000-000000000000', '45f2bfdf-863d-4d0b-89cf-a449f7cce56b', '{"action":"logout","actor_id":"bad97501-ff23-461a-85ec-d260bbe7fe71","actor_username":"newpwerson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-16 02:18:08.403422+00', ''),
	('00000000-0000-0000-0000-000000000000', '203a58cb-cc27-40f4-88c2-031859d5e9a5', '{"action":"user_signedup","actor_id":"50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de","actor_username":"asdfadsf23@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 02:18:19.390997+00', ''),
	('00000000-0000-0000-0000-000000000000', '1eab52ee-696a-4463-99bd-d5519278db47', '{"action":"login","actor_id":"50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de","actor_username":"asdfadsf23@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 02:18:19.395749+00', ''),
	('00000000-0000-0000-0000-000000000000', '01c9316b-4446-4983-bed1-ca3956548900', '{"action":"logout","actor_id":"50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de","actor_username":"asdfadsf23@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-16 02:18:26.641126+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb3fc93d-a6b4-47e1-8076-f8afaf16aa59', '{"action":"user_signedup","actor_id":"86920455-25a4-4279-a9db-30dfa8001013","actor_username":"asdfwqfew2@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 02:30:55.189685+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1421062-6dcd-4245-997b-e3b6acef76ca', '{"action":"login","actor_id":"86920455-25a4-4279-a9db-30dfa8001013","actor_username":"asdfwqfew2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 02:30:55.195986+00', ''),
	('00000000-0000-0000-0000-000000000000', '58000cff-2204-4002-a38c-543276663a7e', '{"action":"logout","actor_id":"86920455-25a4-4279-a9db-30dfa8001013","actor_username":"asdfwqfew2@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-16 02:30:56.787576+00', ''),
	('00000000-0000-0000-0000-000000000000', '1bf1209c-b8ab-479b-9350-971d7216a53c', '{"action":"user_signedup","actor_id":"d6759827-9fac-41cd-affd-1acb9b3aab6f","actor_username":"newnew@gmai.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 04:33:43.401282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb0f5543-c6c3-44cb-8a6e-97b58db38347', '{"action":"login","actor_id":"d6759827-9fac-41cd-affd-1acb9b3aab6f","actor_username":"newnew@gmai.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 04:33:43.405857+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e270acb-3f16-47bc-ac7d-0875c9c03d7b', '{"action":"logout","actor_id":"891baa4e-c02d-467f-848d-4bb81e995ad2","actor_username":"hjm@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-16 02:17:24.34248+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd50dfbc5-4fec-4719-b57d-7fd1f9a5cde6', '{"action":"user_signedup","actor_id":"bad97501-ff23-461a-85ec-d260bbe7fe71","actor_username":"newpwerson@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 02:17:41.244682+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fea8425c-5541-47c0-ba8a-a85ae0800fe7', '{"action":"login","actor_id":"bad97501-ff23-461a-85ec-d260bbe7fe71","actor_username":"newpwerson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 02:17:41.247591+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c48ade91-8932-45c7-9d09-5483f6ea8eaf', '{"action":"logout","actor_id":"d6759827-9fac-41cd-affd-1acb9b3aab6f","actor_username":"newnew@gmai.com","actor_via_sso":false,"log_type":"account"}', '2024-10-16 04:35:17.094311+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b185fcb3-bb9d-4fbb-bb6a-08063639af6a', '{"action":"user_signedup","actor_id":"bb3c166a-4ad1-4e11-ad5c-96be1682fb97","actor_username":"asdf@asdfasdf","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-16 04:35:31.465728+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b19728d-f994-49d8-96f0-feac6112d08f', '{"action":"login","actor_id":"bb3c166a-4ad1-4e11-ad5c-96be1682fb97","actor_username":"asdf@asdfasdf","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-16 04:35:31.472448+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e669ef8a-a5fd-4df3-a27b-a8853f84db9a', '{"action":"logout","actor_id":"bb3c166a-4ad1-4e11-ad5c-96be1682fb97","actor_username":"asdf@asdfasdf","actor_via_sso":false,"log_type":"account"}', '2024-10-16 04:35:34.521716+00', '');


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
	('c8b8784a-61b4-44b5-a2a7-2df83d7e6c0a', '74e45d04-5bd5-4849-b363-65cfad890fa2', '17ebb9d9-48cb-4251-bd3b-bf76a8aa1ea5', 's256', 'oyru_IFQUqTJVWGZ9D284xi41Of403peLQQG3v3qNgQ', 'github', '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', '', '2024-08-26 03:42:42.322348+00', '2024-08-26 03:42:43.171777+00', 'oauth', '2024-08-26 03:42:43.171714+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '0d3eda96-4065-4387-8315-6b552862f1f6', 'authenticated', 'authenticated', 'heather.davies253@gmail.com', NULL, '2024-09-21 00:35:54.999619+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-09-21 00:35:56.325912+00', '{"provider": "github", "providers": ["github"]}', '{"iss": "https://api.github.com", "sub": "26665300", "email": "heather.davies253@gmail.com", "user_name": "heather2535", "avatar_url": "https://avatars.githubusercontent.com/u/26665300?v=4", "provider_id": "26665300", "email_verified": true, "phone_verified": false, "preferred_username": "heather2535"}', NULL, '2024-09-21 00:35:54.97124+00', '2024-09-21 00:35:56.352732+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'afcb16c2-89d8-45c1-a095-4f79c30f4c0f', 'authenticated', 'authenticated', 'asdf@gmail.com', '$2a$10$rwW3zI6CKtWWu8/a46Zfn./tkH51RL2kRPrQDS6oWTIYpemTCAc1O', '2024-10-07 03:40:48.205269+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-07 03:40:48.181277+00', '2024-10-07 03:40:48.205524+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '86920455-25a4-4279-a9db-30dfa8001013', 'authenticated', 'authenticated', 'asdfwqfew2@gmail.com', '$2a$10$skrQSNuuuOUXGYaspf3xvOb0nAgGdxqZNOkT3ANMRyjUbfthLT5H.', '2024-10-16 02:30:55.191969+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 02:30:55.19786+00', '{"provider": "email", "providers": ["email"]}', '{"id": "00", "sub": "86920455-25a4-4279-a9db-30dfa8001013", "role": "recruiter", "email": "asdfwqfew2@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 02:30:55.179946+00', '2024-10-16 02:30:55.204293+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1b71e29e-23a4-4794-afe1-1a50e6caa2a9', 'authenticated', 'authenticated', '1234asdf@gmail.com', '$2a$10$LRPIsIe7684apRAB2uAaoOhEXma0BMkEEzO9rNS70UyDQ1noI1HVe', '2024-10-15 20:45:00.041305+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-15 20:45:00.050473+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1b71e29e-23a4-4794-afe1-1a50e6caa2a9", "role": "recruiter", "email": "1234asdf@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-15 20:45:00.014777+00', '2024-10-15 20:45:00.056367+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6d4772b5-301b-4a82-ac67-7472d811b359', 'authenticated', 'authenticated', 'jddoe@gmail.com', '$2a$10$zEsqPDKU.Xro3I254kMgXuCq8Mz1YrUHfVqeAP2L.kcmhbFeN6sUa', '2024-10-16 01:33:25.329477+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 01:33:25.340399+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "6d4772b5-301b-4a82-ac67-7472d811b359", "role": "recruiter", "email": "jddoe@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 01:33:25.30602+00', '2024-10-16 01:33:25.354275+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '891baa4e-c02d-467f-848d-4bb81e995ad2', 'authenticated', 'authenticated', 'hjm@gmail.com', '$2a$10$DVwSWHu4Js.iOfeFZWoeuu6NQXlqsIRMNeCvHuOPUcJBiI/HUCW2S', '2024-10-16 02:16:49.4557+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 02:16:49.460748+00', '{"provider": "email", "providers": ["email"]}', '{"id": "00", "sub": "891baa4e-c02d-467f-848d-4bb81e995ad2", "role": "recruiter", "email": "hjm@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 02:16:49.439861+00', '2024-10-16 02:16:49.465185+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bad97501-ff23-461a-85ec-d260bbe7fe71', 'authenticated', 'authenticated', 'newpwerson@gmail.com', '$2a$10$Oyy4H.LdsPFSw4CgwNCyke4h79UqreGtJ/SKhTopMhcf1iZAYuM7a', '2024-10-16 02:17:41.245376+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 02:17:41.249568+00', '{"provider": "email", "providers": ["email"]}', '{"id": "00", "sub": "bad97501-ff23-461a-85ec-d260bbe7fe71", "role": "recruiter", "email": "newpwerson@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 02:17:41.224333+00', '2024-10-16 02:17:41.253905+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de', 'authenticated', 'authenticated', 'asdfadsf23@gmail.com', '$2a$10$awerdncwGjFdcVPaDbFuiu68IUOZVb0JVCPBsbzhnbIQdmesfdRYK', '2024-10-16 02:18:19.392443+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 02:18:19.396617+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de", "role": "recruiter", "email": "asdfadsf23@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 02:18:19.3797+00', '2024-10-16 02:18:19.400045+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd6759827-9fac-41cd-affd-1acb9b3aab6f', 'authenticated', 'authenticated', 'newnew@gmai.com', '$2a$10$Fx/iEJsjEYLAbnGYnyYsYuhkZj9G2v7YmSTtiDYS668pKo9wvid22', '2024-10-16 04:33:43.402789+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 04:33:43.407207+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d6759827-9fac-41cd-affd-1acb9b3aab6f", "role": "applicant", "email": "newnew@gmai.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 04:33:43.389501+00', '2024-10-16 04:33:43.410859+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bb3c166a-4ad1-4e11-ad5c-96be1682fb97', 'authenticated', 'authenticated', 'asdf@asdfasdf', '$2a$10$7d6v/dvJqXr9uUIk4a9mFu0hhrVhdPDLnYK7TkwMSibYMxwinEuSC', '2024-10-16 04:35:31.46764+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-16 04:35:31.47416+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "bb3c166a-4ad1-4e11-ad5c-96be1682fb97", "role": "applicant", "email": "asdf@asdfasdf", "email_verified": false, "phone_verified": false}', NULL, '2024-10-16 04:35:31.452315+00', '2024-10-16 04:35:31.478799+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('26665300', '0d3eda96-4065-4387-8315-6b552862f1f6', '{"iss": "https://api.github.com", "sub": "26665300", "email": "heather.davies253@gmail.com", "user_name": "heather2535", "avatar_url": "https://avatars.githubusercontent.com/u/26665300?v=4", "provider_id": "26665300", "email_verified": true, "phone_verified": false, "preferred_username": "heather2535"}', 'github', '2024-09-21 00:35:54.986191+00', '2024-09-21 00:35:54.98624+00', '2024-09-21 00:35:54.98624+00', '0c913ed6-f933-4457-a3e2-d01d54742746'),
	('afcb16c2-89d8-45c1-a095-4f79c30f4c0f', 'afcb16c2-89d8-45c1-a095-4f79c30f4c0f', '{"sub": "afcb16c2-89d8-45c1-a095-4f79c30f4c0f", "email": "asdf@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-07 03:40:48.189137+00', '2024-10-07 03:40:48.189762+00', '2024-10-07 03:40:48.189762+00', 'ba45a73b-c016-4425-bca9-034fcfc31d46'),
	('1b71e29e-23a4-4794-afe1-1a50e6caa2a9', '1b71e29e-23a4-4794-afe1-1a50e6caa2a9', '{"sub": "1b71e29e-23a4-4794-afe1-1a50e6caa2a9", "role": "recruiter", "email": "1234asdf@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-15 20:45:00.027+00', '2024-10-15 20:45:00.028482+00', '2024-10-15 20:45:00.028482+00', '165655c3-15b5-44a1-a9d8-cc1556fb7080'),
	('6d4772b5-301b-4a82-ac67-7472d811b359', '6d4772b5-301b-4a82-ac67-7472d811b359', '{"sub": "6d4772b5-301b-4a82-ac67-7472d811b359", "role": "recruiter", "email": "jddoe@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 01:33:25.317445+00', '2024-10-16 01:33:25.317532+00', '2024-10-16 01:33:25.317532+00', '46635090-5ac9-4dc2-8dad-16e6a3219f60'),
	('891baa4e-c02d-467f-848d-4bb81e995ad2', '891baa4e-c02d-467f-848d-4bb81e995ad2', '{"id": "00", "sub": "891baa4e-c02d-467f-848d-4bb81e995ad2", "role": "recruiter", "email": "hjm@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 02:16:49.449589+00', '2024-10-16 02:16:49.44964+00', '2024-10-16 02:16:49.44964+00', '63e58498-a2da-4d8c-8314-247b3729dc45'),
	('bad97501-ff23-461a-85ec-d260bbe7fe71', 'bad97501-ff23-461a-85ec-d260bbe7fe71', '{"id": "00", "sub": "bad97501-ff23-461a-85ec-d260bbe7fe71", "role": "recruiter", "email": "newpwerson@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 02:17:41.240566+00', '2024-10-16 02:17:41.240644+00', '2024-10-16 02:17:41.240644+00', 'ecfbde52-efd1-46c9-8b7f-079a716993df'),
	('50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de', '50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de', '{"sub": "50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de", "role": "recruiter", "email": "asdfadsf23@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 02:18:19.385224+00', '2024-10-16 02:18:19.385279+00', '2024-10-16 02:18:19.385279+00', '4cd0e4c8-b10d-4977-9a1b-aa9be6de3e16'),
	('86920455-25a4-4279-a9db-30dfa8001013', '86920455-25a4-4279-a9db-30dfa8001013', '{"id": "00", "sub": "86920455-25a4-4279-a9db-30dfa8001013", "role": "recruiter", "email": "asdfwqfew2@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 02:30:55.185421+00', '2024-10-16 02:30:55.1855+00', '2024-10-16 02:30:55.1855+00', '2573494f-fdb0-4b1c-9a80-1078b49fd475'),
	('d6759827-9fac-41cd-affd-1acb9b3aab6f', 'd6759827-9fac-41cd-affd-1acb9b3aab6f', '{"sub": "d6759827-9fac-41cd-affd-1acb9b3aab6f", "role": "applicant", "email": "newnew@gmai.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 04:33:43.396235+00', '2024-10-16 04:33:43.396284+00', '2024-10-16 04:33:43.396284+00', 'dfa483b7-ddc0-40a4-bc43-6e2e060850e5'),
	('bb3c166a-4ad1-4e11-ad5c-96be1682fb97', 'bb3c166a-4ad1-4e11-ad5c-96be1682fb97', '{"sub": "bb3c166a-4ad1-4e11-ad5c-96be1682fb97", "role": "applicant", "email": "asdf@asdfasdf", "email_verified": false, "phone_verified": false}', 'email', '2024-10-16 04:35:31.459768+00', '2024-10-16 04:35:31.459819+00', '2024-10-16 04:35:31.459819+00', 'a17a4627-52c3-4e4b-8ef4-8b50735c9f99');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('9e163b40-db97-4dd2-accc-c22a990547cc', '0d3eda96-4065-4387-8315-6b552862f1f6', '2024-09-21 00:35:56.32679+00', '2024-09-21 00:35:56.32679+00', NULL, 'aal1', NULL, NULL, 'node', '3.236.126.187', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('9e163b40-db97-4dd2-accc-c22a990547cc', '2024-09-21 00:35:56.353275+00', '2024-09-21 00:35:56.353275+00', 'oauth', '8ecfa334-74fb-4f22-a818-2504473dab2b');


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
	('00000000-0000-0000-0000-000000000000', 7, '_dVt3drwWvWCG1yce3yMTw', '0d3eda96-4065-4387-8315-6b552862f1f6', false, '2024-09-21 00:35:56.332729+00', '2024-09-21 00:35:56.332729+00', NULL, '9e163b40-db97-4dd2-accc-c22a990547cc');


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
-- Data for Name: AI_config; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: AI_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: applicants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applicants" ("id", "harvest_applicants") VALUES
	('d6759827-9fac-41cd-affd-1acb9b3aab6f', NULL),
	('bb3c166a-4ad1-4e11-ad5c-96be1682fb97', NULL);


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



--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."jobs" ("id", "company_id", "harvest_jobs", "AIconfig_id") VALUES
	('214a3876-8e8a-4ed6-9d6b-cde132719f26', NULL, NULL, NULL);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: recruiters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."recruiters" ("id", "avatar_url", "billing_address", "payment_method", "company_id", "harvest_recruiters") VALUES
	('891baa4e-c02d-467f-848d-4bb81e995ad2', NULL, NULL, NULL, NULL, NULL),
	('bad97501-ff23-461a-85ec-d260bbe7fe71', NULL, NULL, NULL, NULL, NULL),
	('50c6504d-09fd-43ed-9c4a-dfbbb9f3b6de', NULL, NULL, NULL, NULL, NULL),
	('86920455-25a4-4279-a9db-30dfa8001013', NULL, NULL, NULL, NULL, NULL);


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
	('4d52434a-9cd4-45de-aa72-0b6a81914813', 'Interviews', 'Untitled folder/.emptyFolderPlaceholder', NULL, '2024-08-14 21:31:26.907506+00', '2024-08-14 21:31:26.907506+00', '2024-08-14 21:31:26.907506+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-14T21:31:27.000Z", "contentLength": 0, "httpStatusCode": 200}', '0b10d928-4988-4619-b000-d5a4220fdd6c', NULL, '{}'),
	('e502db4c-3636-4c27-9400-8ada09769a14', 'Resumes', 'alex_resume', NULL, '2024-10-10 05:18:17.813273+00', '2024-10-10 05:18:17.813273+00', '2024-10-10 05:18:17.813273+00', '{"eTag": "\"54231afee72d9c5513cbfc588a5a6e03-1\"", "size": 40565, "mimetype": "binary/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-10-10T05:18:18.000Z", "contentLength": 40565, "httpStatusCode": 200}', '33ad92ce-301b-43bd-9b41-9106e2ef5978', NULL, NULL);


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 15, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
