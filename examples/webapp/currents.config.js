module.exports = {
  e2e: {
    batchSize: 3, // how many specs to send in one batch
  },
  component: {
    batchSize: 3, // how many specs to send in one batch
  },
  projectId: !!(process.env.GITHUB_ACTION || process.env.CIRCLE_BRANCH)
    ? "pLJwwO"
    : "1OPP8c",
};
