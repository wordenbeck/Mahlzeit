-- SanaMana: Set Zubereitungszeit
BEGIN;

UPDATE recipes SET zubereitungszeit_min = 10, updated_at = NOW() WHERE id = '74dd7bca-4ad2-4e01-a4b2-7a42cc3aa4aa';
UPDATE recipes SET zubereitungszeit_min = 30, updated_at = NOW() WHERE id = 'feacd86e-79e9-483a-a3b2-38aa91041602';
UPDATE recipes SET zubereitungszeit_min = 30, updated_at = NOW() WHERE id = '8975bd8a-b045-414f-9695-1b92f2fe9dd8';
UPDATE recipes SET zubereitungszeit_min = 20, updated_at = NOW() WHERE id = '01d70c7a-4dfa-46d2-862b-c62f692f9773';
UPDATE recipes SET zubereitungszeit_min = 45, updated_at = NOW() WHERE id = 'dec5c8b0-db03-4f72-96d7-11f6a9955f2e';
UPDATE recipes SET zubereitungszeit_min = 25, updated_at = NOW() WHERE id = '39f7096e-bdb0-457c-888e-39983e76446a';
UPDATE recipes SET zubereitungszeit_min = 25, updated_at = NOW() WHERE id = 'cc3efc47-71be-4899-8ace-a879b1571dc3';
UPDATE recipes SET zubereitungszeit_min = 20, updated_at = NOW() WHERE id = 'dd80fa36-b5f5-4362-ad5a-5d6bd98a479b';
UPDATE recipes SET zubereitungszeit_min = 45, updated_at = NOW() WHERE id = '1f7cd2d0-b141-4a5e-a8a1-58a2ef61651f';
UPDATE recipes SET zubereitungszeit_min = 35, updated_at = NOW() WHERE id = 'dce36202-2d62-49e1-9382-93d1dc2a8a09';
UPDATE recipes SET zubereitungszeit_min = 25, updated_at = NOW() WHERE id = '75b8a87a-e7dd-4ae7-a01c-8cb499f6f2d9';
UPDATE recipes SET zubereitungszeit_min = 25, updated_at = NOW() WHERE id = '6625a77f-d143-4f3e-a279-3bef7ec02def';
UPDATE recipes SET zubereitungszeit_min = 45, updated_at = NOW() WHERE id = '7f870d43-8998-4d5d-a3bb-def6ff89e718';
UPDATE recipes SET zubereitungszeit_min = 20, updated_at = NOW() WHERE id = '1a3e71b9-3b3d-42c7-8936-d8c55cc09997';
UPDATE recipes SET zubereitungszeit_min = 45, updated_at = NOW() WHERE id = 'ae329456-799a-45ca-bef6-1c707c196885';
UPDATE recipes SET zubereitungszeit_min = 35, updated_at = NOW() WHERE id = '124f0007-d2da-484c-bb6a-460169e49a3b';
UPDATE recipes SET zubereitungszeit_min = 20, updated_at = NOW() WHERE id = 'b92654ac-2a3e-489f-ae49-a843c7d8ab15';
UPDATE recipes SET zubereitungszeit_min = 6, updated_at = NOW() WHERE id = 'cabc2bcb-297e-45e7-b866-7c3eb3d2e808';
UPDATE recipes SET zubereitungszeit_min = 15, updated_at = NOW() WHERE id = 'a20c70ec-1d6e-40e2-9b4c-b7c4b4780cd8';
UPDATE recipes SET zubereitungszeit_min = 15, updated_at = NOW() WHERE id = '07ff2fe6-69e5-4fdc-93b4-16fb0a148b41';
UPDATE recipes SET zubereitungszeit_min = 30, updated_at = NOW() WHERE id = '61102237-5c89-4280-8e59-e92cee652327';
UPDATE recipes SET zubereitungszeit_min = 30, updated_at = NOW() WHERE id = '86262752-72e7-41b8-aa28-4ba9bce4d644';
UPDATE recipes SET zubereitungszeit_min = 10, updated_at = NOW() WHERE id = 'f4bbfdeb-53df-40a4-881a-a0c8c3307d95';
UPDATE recipes SET zubereitungszeit_min = 35, updated_at = NOW() WHERE id = '7caf4597-cfaa-4b22-85a8-719d7718abd3'; -- Penne mit Linsen-Bolognese (geschätzt)

COMMIT;
