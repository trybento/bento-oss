# Launch reporting

Launch reporting is for us to check the internals of auto launching, and checking what the logic is running against.

It will generate a lot of noise and data, so **do not turn on in production**, and also only **use sparingly in staging**. The logs will generate even on failed checks, because we need to know whether or not a guide was checked for and did not meet criteria.

## Usage

Toggle the `core.internal_feature_flags` flags to enable

- "enable launch report for identify" enables logging when new users and accounts are created
- "enable launch report for mutations" enables logging when templates are modified and applied to existing accounts

When there is targeting activity being checked, the results will dump into `debug.launch_reports`

## Examples

```json
{
  "type": "accountUser",
  "checks": {
    "template_135": "(user guide) matched user user/all targets",
    "template_139": "(account guide) matched user/all targets",
    "template_140": "(user guide) matched user user/all targets"
  },
  "accountUserId": 501,
  "organizationId": 17
}
```

This entry tells us that an account user (ID 501) was created and is checking against existing templates. We see that they have checked against template IDs 135, 139, and 140, and added to them due to a DB targeting match. Most likely, they are "all" or "user" type rule matches since we do not match against attributes in the database.

If we were expecting template 138 to be checked, for example, we would see that the check didn't run at all and as such wasn't even picked up by the initial query for matching. A good next step is to see if the rules are set as expected, or to check the query for other conditions on why they wouldn't match template 138.

```json
{
  "type": "account",
  "checks": {
    "template_90": {
      "failedRules": [],
      "matchedRules": [
        {
          "ruleType": "ne",
          "attrValue": "Chaldea Security",
          "ruleValue": "Bentonian Vineyards"
        }
      ]
    },
    "template_127": "allTarget",
    "template_135": "allTarget"
  },
  "accountId": 53,
  "organizationId": 17
}
```

This entry is an account being checked for guide base creation. The guide base for template 90 was created for account 53 because it matched the rule "Chaldea Security (ne) Bentonian Vineyards", and created for 127 and 135 because they had the "all" target set.

```json
{
  "type": "template",
  "checks": {
    "accountUser_503": "allTarget",
    "accountUser_504": "allTarget"
  },
  "templateId": 143,
  "organizationId": 2
}
```

Here, we see a template's rules being updated. It has checked against account users 503 and 504 and added them since they were not on template 143 previously, but now are.
