import * as dbSetup from '@utils/dbSetup';

beforeAll(async () => {
  await dbSetup.resetData();
});

afterAll(async () => {
  await dbSetup.resetData();
  await dbSetup.resetSequence();
});

