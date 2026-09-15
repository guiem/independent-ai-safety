import test from "node:test";
import assert from "node:assert/strict";
import { stableJson, toCsv, xmlEscape } from "../scripts/lib.mjs";

test("stableJson recursively sorts object keys", () => {
  assert.equal(stableJson({ z:1, a:{ d:2, b:1 } }), '{\n  "a": {\n    "b": 1,\n    "d": 2\n  },\n  "z": 1\n}\n');
});

test("CSV escapes quotes and arrays", () => {
  assert.equal(toCsv([{ name:'A "quoted" name', tags:["one","two"] }], ["name","tags"]), '"name","tags"\n"A ""quoted"" name","one|two"\n');
});

test("GraphML values are escaped", () => {
  assert.equal(xmlEscape('A & <B> "C"'), "A &amp; &lt;B&gt; &quot;C&quot;");
});

