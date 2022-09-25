'use strict';

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: ['http://192.168.3.25:9210']
});

const docs = [
    {
        character: 'Ned Stark',
        quote: 'Winter is coming.',
    },
    {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.',
    },
    {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.',
    }
];

class ESearch {
    constructor(index) {
        index = String(index || '').trim();
        if (!index) {
            throw new Error('');
        }
        this.index = index;
    }
    async create(document) {
        await client.index({
            index: this.index,
            document: { ...document },
        });
    }

    async search(query = {}) {
        await client.search({
            index: this.index,
            query: query
        });
    }
}

(async () => {
    let esearch = new ESearch('test');

    // Let's start by indexing some data
    await esearch.create({
        character: 'Ned Stark',
        quote: 'Winter is coming.',
    });

    // // here we are forcing an index refresh, otherwise we will not
    // // get any result in the consequent search
    await client.indices.refresh({ index: 'game-of-thrones' });

    // Let's search!
    const result = await esearch.search({
        match: {
            character: "Daenerys*"
        }
    });

    console.log(result.hits);

    run().catch(console.log);
})();