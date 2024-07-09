const mongoose = require('mongoose');
const multer = require('multer');
const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLUpload } = require('graphql-upload');

const app = express();
const upload = multer({ dest: '/tmp' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const artSchema = new mongoose.Schema({
    name: String,
    reason: String,
    image: String,
});

const Art = mongoose.model('Art', artSchema);

const typeDefs = gql`
    scalar Upload

    type Art {
        id: ID!
        name: String!
        reason: String!
        image: String!
    }

    type Query {
        arts: [Art]
    }

    type Mutation {
        submitArt(name: String!, reason: String!, image: Upload!): Art
    }
`;

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        arts: async () => Art.find(),
    },
    Mutation: {
        submitArt: async (_, { name, reason, image }) => {
            const { createReadStream, filename } = await image;
            const filePath = `/tmp/${filename}`;
            const stream = createReadStream();
            const out = require('fs').createWriteStream(filePath);
            stream.pipe(out);
            await new Promise((resolve, reject) => {
                out.on('finish', resolve);
                out.on('error', reject);
            });

            const newArt = new Art({ name, reason, image: filePath });
            await newArt.save();
            return newArt;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/' });

const handler = (req, res) => {
    const parsedUrl = parse(req.url, true);
    app(req, res, parsedUrl);
};

module.exports = { handler };
