module.exports = {
  /**
   * @param {{ name: string; strategy: 'all' | 'none' | 'percentage' | 'stringMatch' | 'rateDict'; options?: Record<string, any> | null; }} flag
   */
  createInternalFeatureFlag: async (flag, queryInterface) => {
    await queryInterface.bulkInsert(
      { tableName: 'internal_feature_flags', schema: 'core' },
      [
        {
          name: flag.name,
          strategy: flag.strategy,
          options: flag.options ? JSON.stringify(flag.options) : null,
        },
      ],
      { returning: true }
    );
  },

  deleteInternalFeatureFlag: async (flagName, queryInterface) => {
    await queryInterface.bulkDelete(
      { tableName: 'internal_feature_flags', schema: 'core' },
      { name: flagName }
    );
  },
};
