import { describe, expect, it } from "vitest";
import { BfgProtocolTypeSchema } from "../../src/bfg-protocols/bfg-protocol-type";

const expectValidationIssue = (
  input: Record<string, unknown>,
  expected: { code: string; path: (string | number)[]; messageIncludes: string }
) => {
  const result = BfgProtocolTypeSchema.safeParse(input);

  expect(result.success).toBe(false);

  if (!result.success) {
    const [issue] = result.error.issues;

    expect(issue?.code).toBe(expected.code);
    expect(issue?.path).toEqual(expected.path);
    expect(issue?.message).toContain(expected.messageIncludes);
  }
};

const validBase = {
  bfgProtocolHandlerPrefix: "bfg",
  dataSource: "p2p",
  encodingFormat: "json",
  semanticType: "json",
  bootstrapString: "bootstrap",
};

const invalidPrefixes = [
  {
    label: "handles non-bfg prefix",
    override: { bfgProtocolHandlerPrefix: "not-bfg" },
  },
];

const invalidDataSources = [
  {
    label: "rejects bluetooth",
    override: { dataSource: "bluetooth" },
  },
];

const invalidEncodingFormats = [
  {
    label: "rejects yaml",
    override: { encodingFormat: "yaml" },
  },
];

const invalidSemanticTypes = [
  {
    label: "rejects yaml",
    override: { semanticType: "yaml" },
  },
];

const missingBootstrapStrings = [
  {
    label: "omits bootstrapString",
    override: { bootstrapString: undefined },
  },
];

describe("BfgProtocolTypeSchema", () => {
  it("parses a fully valid protocol definition", () => {
    const result = BfgProtocolTypeSchema.parse({
      bfgProtocolHandlerPrefix: "bfg",
      dataSource: "p2p",
      encodingFormat: "json",
      semanticType: "json",
      bootstrapString: "game://bootstrap",
    });

    expect(result.bootstrapString).toBe("game://bootstrap");
  });

  it.each(invalidPrefixes)("rejects invalid prefix: %s", ({ label, override }) => {
    expectValidationIssue(
      { ...validBase, ...override },
      {
        code: "invalid_value",
        path: ["bfgProtocolHandlerPrefix"],
        messageIncludes: "expected \"bfg\"",
      }
    );
  });

  it.each(invalidDataSources)("rejects invalid data source: %s", ({ label, override }) => {
    expectValidationIssue(
      { ...validBase, ...override },
      {
        code: "invalid_value",
        path: ["dataSource"],
        messageIncludes: "expected one of \"p2p\"|\"http\"|\"tb\"|\"address-bar\"|\"file\"",
      }
    );
  });

  it.each(invalidEncodingFormats)("rejects invalid encoding format: %s", ({ label, override }) => {
    expectValidationIssue(
      { ...validBase, ...override },
      {
        code: "invalid_value",
        path: ["encodingFormat"],
        messageIncludes: "expected one of \"json\"|\"text\"|\"binary\"",
      }
    );
  });

  it.each(invalidSemanticTypes)("rejects invalid semantic type: %s", ({ label, override }) => {
    expectValidationIssue(
      { ...validBase, ...override },
      {
        code: "invalid_value",
        path: ["semanticType"],
        messageIncludes: "expected one of \"json\"|\"text\"|\"binary\"",
      }
    );
  });

  it.each(missingBootstrapStrings)("rejects missing bootstrapString: %s", ({ label, override }) => {
    const { bootstrapString: _ignored, ...input } = { ...validBase, ...override };

    expectValidationIssue(
      input,
      {
        code: "invalid_type",
        path: ["bootstrapString"],
        messageIncludes: "expected string",
      }
    );
  });
});
