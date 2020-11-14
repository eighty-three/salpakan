import db from '@utils/db';

const tables = [
  'accounts'
];

const seqs = [
  { table: 'accounts', serialColumn: 'user_id' },
];

export const resetData = async (): Promise<void> => {
  try {
    await db.tx(t => {
      const mappedTables = tables.map((table) => {
        t.none('DELETE FROM $1:name', [table]);
      });

      return t.batch(mappedTables);
    });
  } catch (err) {
    console.log(err);
    console.log('Error from setup');
  };
};

export const resetSequence = async (): Promise<void> => {
  // await db.none('ALTER SEQUENCE <tablename>_<id>_seq RESTART;');
  try {
    await db.tx(t => {
      const mappedSeqs = seqs.map((obj) => {
        const input = `${obj.table}_${obj.serialColumn}_seq`;
        t.none('ALTER SEQUENCE $1:name RESTART', [input]);
      });

      return t.batch(mappedSeqs);
    });
  } catch (err) {
    console.log(err);
    console.log('Error from setup');
  };
};
