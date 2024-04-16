export function getIsAnyStepAutoCompleteRuleIncomplete(rules) {
  // Allow events without properties.
  const firstRule = rules?.[0] || {};
  const isEventWithoutProperties =
    rules.length <= 1 && Object.keys(firstRule).length === 0;

  if (isEventWithoutProperties) return false;

  return !!rules.find(
    (rule) =>
      !rule.propertyName ||
      !rule.valueType ||
      !rule.ruleType ||
      (rule.valueType === 'text' && !rule.textValue) ||
      (rule.valueType === 'number' &&
        (rule.numberValue === null || rule.numberValue === undefined)) ||
      (rule.valueType === 'date' && !rule.dateValue) ||
      (rule.valueType === 'boolean' &&
        (rule.booleanValue === null || rule.booleanValue === undefined)) // NOTE: DB migration needed to allow NULL booleanValue
  );
}
