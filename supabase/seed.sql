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
	('00000000-0000-0000-0000-000000000000', '1ab3ca67-30f3-4658-8eeb-be53d2c43fdb', '{"action":"user_signedup","actor_id":"32ea934d-72ab-45c3-99ad-fb95800eec8f","actor_name":"Ben Gardiner","actor_username":"bengard@bu.edu","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-12-05 19:15:17.619277+00', ''),
	('00000000-0000-0000-0000-000000000000', '01e1edb3-93d6-4d30-8545-1762bbdbd3bb', '{"action":"login","actor_id":"32ea934d-72ab-45c3-99ad-fb95800eec8f","actor_name":"Ben Gardiner","actor_username":"bengard@bu.edu","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-05 19:15:17.629446+00', ''),
	('00000000-0000-0000-0000-000000000000', '0676acf0-5baa-4f34-bbd8-995886df835d', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bengardiner18@gmail.com","user_id":"807d07d8-3569-4142-90a6-5a36bca95b65"}}', '2024-12-05 19:37:18.63978+00', ''),
	('00000000-0000-0000-0000-000000000000', '03927698-c952-4cd8-9fd4-b4e0bfa50c00', '{"action":"login","actor_id":"32ea934d-72ab-45c3-99ad-fb95800eec8f","actor_name":"Ben Gardiner","actor_username":"bengard@bu.edu","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-05 21:33:52.411423+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f360ef6c-82d7-42dd-aff1-62ff0486e447', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lyoon02@bu.edu","user_id":"a5675bf4-8ca5-4c2e-a4d2-9098be4735d8"}}', '2024-12-05 21:34:11.883237+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c04c797e-eb88-4e05-abf4-a83a6854b7df', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lyoon02@bu.edu","user_id":"f845c4d2-dbfe-4a23-bf6e-3e4a200f8754"}}', '2024-12-05 21:43:23.893704+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbe201cf-a724-4797-a1ae-7460c21037d5', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lyoon02@bu.edu","user_id":"1b54b515-7165-4fdc-a7d1-209515928331"}}', '2024-12-05 21:49:34.372259+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0060ed1-aad7-432e-b338-8ee1619ea568', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lyoon02@bu.edu","user_id":"57f5e265-1b4a-4136-9332-16ee490f5aa4"}}', '2024-12-05 22:00:39.942067+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '807d07d8-3569-4142-90a6-5a36bca95b65', 'authenticated', 'authenticated', 'bengardiner18@gmail.com', '', NULL, '2024-12-05 19:37:18.642084+00', '349a60c75eab6367520d11a54199032a79b84c13a28f9cb73647dfbd', '2024-12-05 19:37:18.642084+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "applicant", "full_name": "Ben Gardiner"}', NULL, '2024-12-05 19:37:18.622746+00', '2024-12-05 19:37:18.683916+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '32ea934d-72ab-45c3-99ad-fb95800eec8f', 'authenticated', 'authenticated', 'bengard@bu.edu', '$2a$10$gDFfQAIeF7axAD6Q3GjRe.oiS6aRASd3F6nsaGeECWGKD2Nz5/iTm', '2024-12-05 19:15:17.622514+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-05 21:33:52.414316+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "32ea934d-72ab-45c3-99ad-fb95800eec8f", "role": "recruiter", "email": "bengard@bu.edu", "full_name": "Ben Gardiner", "email_verified": false, "phone_verified": false}', NULL, '2024-12-05 19:15:17.594372+00', '2024-12-05 21:33:52.421394+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '57f5e265-1b4a-4136-9332-16ee490f5aa4', 'authenticated', 'authenticated', 'lyoon02@bu.edu', '', NULL, '2024-12-05 22:00:39.942556+00', '9509d1165bec5060e68afa7c20475eec2b1d2a74bec608e892611c02', '2024-12-05 22:00:39.942556+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "recruiter", "full_name": "Lucas Yoon", "company_id": "e2ad1e02-09d5-48ed-ad1d-3e6d358f0675"}', NULL, '2024-12-05 22:00:39.938215+00', '2024-12-05 22:00:39.947834+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('32ea934d-72ab-45c3-99ad-fb95800eec8f', '32ea934d-72ab-45c3-99ad-fb95800eec8f', '{"sub": "32ea934d-72ab-45c3-99ad-fb95800eec8f", "role": "recruiter", "email": "bengard@bu.edu", "full_name": "Ben Gardiner", "email_verified": false, "phone_verified": false}', 'email', '2024-12-05 19:15:17.612652+00', '2024-12-05 19:15:17.612682+00', '2024-12-05 19:15:17.612682+00', '6145d734-8818-4a51-9de9-db481abf642d'),
	('807d07d8-3569-4142-90a6-5a36bca95b65', '807d07d8-3569-4142-90a6-5a36bca95b65', '{"sub": "807d07d8-3569-4142-90a6-5a36bca95b65", "email": "bengardiner18@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-05 19:37:18.634378+00', '2024-12-05 19:37:18.634409+00', '2024-12-05 19:37:18.634409+00', '7d176737-af0a-4498-9838-bcb351dc2437'),
	('57f5e265-1b4a-4136-9332-16ee490f5aa4', '57f5e265-1b4a-4136-9332-16ee490f5aa4', '{"sub": "57f5e265-1b4a-4136-9332-16ee490f5aa4", "email": "lyoon02@bu.edu", "email_verified": false, "phone_verified": false}', 'email', '2024-12-05 22:00:39.941433+00', '2024-12-05 22:00:39.941468+00', '2024-12-05 22:00:39.941468+00', '318994ae-569c-49c6-a50f-d29640a40abb');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('d1c9a24f-cec3-4961-8982-4ff0c717727b', '32ea934d-72ab-45c3-99ad-fb95800eec8f', '2024-12-05 19:15:17.630154+00', '2024-12-05 19:15:17.630154+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('8bdc1350-fcb4-45b0-abf8-9032129c7d2f', '32ea934d-72ab-45c3-99ad-fb95800eec8f', '2024-12-05 21:33:52.414403+00', '2024-12-05 21:33:52.414403+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('d1c9a24f-cec3-4961-8982-4ff0c717727b', '2024-12-05 19:15:17.640049+00', '2024-12-05 19:15:17.640049+00', 'password', '3d1aa96d-6828-4915-b426-c51f63b4bd54'),
	('8bdc1350-fcb4-45b0-abf8-9032129c7d2f', '2024-12-05 21:33:52.42219+00', '2024-12-05 21:33:52.42219+00', 'password', 'b8ab1f29-6957-4be8-8597-052be28a2997');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('5f58029f-8f45-42df-bc87-e7b2d750ea8a', '807d07d8-3569-4142-90a6-5a36bca95b65', 'confirmation_token', '349a60c75eab6367520d11a54199032a79b84c13a28f9cb73647dfbd', 'bengardiner18@gmail.com', '2024-12-05 19:37:18.691094', '2024-12-05 19:37:18.691094'),
	('4c9bc82b-e968-476a-98c9-df8ce83556be', '57f5e265-1b4a-4136-9332-16ee490f5aa4', 'confirmation_token', '9509d1165bec5060e68afa7c20475eec2b1d2a74bec608e892611c02', 'lyoon02@bu.edu', '2024-12-05 22:00:39.948685', '2024-12-05 22:00:39.948685');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'jON6gxkjAZWirCAHjkbQ0g', '32ea934d-72ab-45c3-99ad-fb95800eec8f', false, '2024-12-05 19:15:17.634013+00', '2024-12-05 19:15:17.634013+00', NULL, 'd1c9a24f-cec3-4961-8982-4ff0c717727b'),
	('00000000-0000-0000-0000-000000000000', 2, 'SNNW3LPVpATRsaseNlUKIg', '32ea934d-72ab-45c3-99ad-fb95800eec8f', false, '2024-12-05 21:33:52.418916+00', '2024-12-05 21:33:52.418916+00', NULL, '8bdc1350-fcb4-45b0-abf8-9032129c7d2f');


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
-- Data for Name: applicants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applicants" ("id", "merge_applicant_id") VALUES
	('807d07d8-3569-4142-90a6-5a36bca95b65', '40355436-4dc2-4fa2-9a3f-698f35669efd');


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
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."companies" ("name", "location", "industry", "description", "email_extension", "website_url", "id", "subscription_id", "billing_address", "merge_account_token", "payment_method", "company_context") VALUES
	('Talentora', 'Boston, MA', 'HR Tech', NULL, NULL, NULL, 'e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', NULL, NULL, 'g6idwsqSM-sMweHpXBGsYdloT7A0DrRvcabJ0f6Aw-yp2MrofKRaMA', NULL, NULL);


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."jobs" ("company_id", "merge_id", "id") VALUES
	('e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', '6590b339-db89-415a-bc62-b3599af6bc48', '6876cfee-0bad-4944-affe-b705e92ef4f3');


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applications" ("created_at", "applicant_id", "job_id", "id") VALUES
	('2024-12-05 19:39:21.393642+00', '807d07d8-3569-4142-90a6-5a36bca95b65', '6590b339-db89-415a-bc62-b3599af6bc48', '5f23f60e-e9c0-4371-b157-049c807ad047');


--
-- Data for Name: AI_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bots; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bots" ("id", "created_at", "name", "voice", "description", "prompt", "company_id", "icon", "role", "emotion") VALUES
	(1, '2024-12-05 19:34:37.093106+00', 'Bob', '{"id": "79f8b5fb-2cc8-479a-80df-29f7a7cf1a3e", "name": "Nonfiction Man", "gender": "masculine", "language": "en", "embedding": [0.10524034, 0.036516823, 0.08379461, -0.0008536052, -0.030912986, 0.12763357, 0.035265494, 0.051463086, -0.14874107, 0.08530694, -0.002666726, 0.07297309, 0.019096784, 0.052431844, 0.0019880654, -0.081137374, -0.04133976, 0.012448823, 0.094353974, -0.15502396, 0.17556168, -0.016467419, -0.1071745, 0.13175344, -0.022903686, 0.10742437, 0.019934922, -0.06545218, -0.06414428, -0.16530125, 0.0064731776, -0.021217234, -0.00085768464, 0.00011085053, -0.02334162, 0.08068573, -0.07263501, 0.013672663, 0.06694877, 0.06821649, -0.020699661, 0.055973656, 0.085257694, 0.016610654, -0.0719807, -0.08541163, 0.04399785, -0.15496898, -0.029270595, -0.04526015, 0.10471187, 0.10386201, -0.016651833, 0.073091775, 0.02018194, 0.01805716, 0.09070067, -0.06742347, 0.0043610507, 0.05342529, -0.11835528, -0.14587244, 0.043436855, 0.04056294, -0.029465329, 0.039710104, 0.10268669, 0.015919376, -0.07867825, 0.26217216, 0.067276746, -0.0658388, -0.0087163355, 0.21219166, 0.018791754, 0.0351091, 0.053658996, -0.028242748, -0.054346297, -0.04304397, 0.08727209, -0.07323659, -0.0026997935, -0.07639795, -0.09074672, 0.009193541, -0.008581618, -0.00991375, 0.07279599, 0.08648909, 0.054638315, -0.038665026, -0.111700945, 0.02125478, -0.16177021, -0.018422322, 0.004991134, 0.012886459, -0.0687685, 0.020180603, 0.057892803, 0.018106582, -0.07973107, -0.000906125, 0.08395246, -0.006492026, 0.066874415, -0.00057541585, 0.03213199, 0.089684755, 0.03864614, 0.07406645, 0.0125942305, -0.020572936, 0.057794824, 0.020129846, -0.03784049, -0.055392563, 0.066848285, -0.10005552, 0.011906698, -0.010718932, 0.097021565, 0.035597388, 0.10532967, -0.020827781, -0.056140043, -0.108077444, 0.08420555, -0.0008438316, 0.1191433, -0.08149342, 0.047034085, 0.03372324, -0.06637179, 0.019952752, -0.084601626, -0.06532088, 0.078291185, 0.030400032, -0.012597609, 0.10552426, 0.05080604, -0.13780367, 0.06388313, 0.057912324, -0.055785883, -0.09924558, -0.024003623, 0.051238224, 0.053676255, -0.031032093, 0.000245127, -0.017655622, 0.033001196, -0.043401588, -0.033300664, -0.036218338, -0.07647873, -0.057232864, 0.04530946, 0.011687513, -0.09498464, 0.022615839, -0.090504795, 0.07060739, -0.005542068, -0.017781602, 0.056733254, -0.09394165, -0.031787034, 0.046881177, -0.038988, -0.00040113737, 0.036516517, -0.06187285, -0.048517726, 0.03323435, -0.050069597, 0.06782466, 0.17804964, -0.03509199, 0.056292336, 0.026197381, -0.08660235, -0.11322905, 0.06624886, -0.074095465, 0.10009627, -0.066993296, -0.052724812, 0.058329698], "is_public": true, "api_status": "unlocked", "created_at": "2024-05-04T19:19:15.979133-07:00", "description": "This voice is smooth, confident, and resonant, perfect for narrating educational content"}', 'Finds 10x engineers', 'Look for nextjs, react, and tailwind skills', 'e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', 'Bot', 'Technical Recruiter', '{"anger": 1, "speed": 1, "sadness": 1, "surprise": 1, "curiosity": 1, "positivity": 1}');


--
-- Data for Name: company_context; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."company_context" ("id", "created_at", "description", "culture", "goals", "history", "products", "customers") VALUES
	('e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', '2024-12-05 19:24:18.292306+00', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.', 'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: job_interview_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."job_interview_config" ("job_id", "created_at", "interview_questions", "company_context", "bot_id", "duration", "type", "interview_name", "hiring_manager_notes", "preferred_qual", "min_qual") VALUES
	('6590b339-db89-415a-bc62-b3599af6bc48', '2024-12-05 19:33:50.869025+00', '[{"id": "c3e9f48b-393e-488e-a38a-ea03167d8b4d", "order": 1, "question": "Tell me about yourself?", "sample_response": "a good response should be concise and genuine"}, {"id": "2584afab-32b4-43ce-965c-9e63c28f79e2", "order": 2, "question": "Why should we hire you?", "sample_response": "f"}]', 'e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', 1, 20, 'behavioral', 'Software Engineer 1 Interview', '', NULL, NULL);


--
-- Data for Name: recruiters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."recruiters" ("id", "avatar_url", "billing_address", "payment_method", "company_id", "harvest_recruiters") VALUES
	('32ea934d-72ab-45c3-99ad-fb95800eec8f', NULL, NULL, NULL, 'e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', NULL),
	('57f5e265-1b4a-4136-9332-16ee490f5aa4', NULL, NULL, NULL, 'e2ad1e02-09d5-48ed-ad1d-3e6d358f0675', NULL);


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 2, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: bots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."bots_id_seq"', 1, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
