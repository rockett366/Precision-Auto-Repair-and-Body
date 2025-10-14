// --- Password helpers ---
export const PWD_MIN = 8;

export function computePasswordRules(next) {
  return {
    len: (next || "").length >= PWD_MIN,
    upper: /[A-Z]/.test(next || ""),
    number: /\d/.test(next || ""),
    special: /[^A-Za-z0-9]/.test(next || ""),
  };
}

export function passwordsMatch(next, confirm) {
  return (next || "").length > 0 && (next || "") === (confirm || "");
}


/** Dynamic checklist component for password strength rules on the client portal.
    Usage:   <PasswordChecklist rules={rules} matchOk={matchOk} styles={styles} />  */
import React from "react";
export function PasswordChecklist({ rules, matchOk, styles }) {
  return (
    <div className={styles.formFullRow} style={{ marginTop: 8 }}>
      <p><strong>Password must contain:</strong></p>
      <ul className={styles.validationList}>
        <li className={rules.len ? styles.validationPass : styles.validationFail}>
          {rules.len ? "✓" : "•"} At least 8 characters
        </li>
        <li className={rules.upper ? styles.validationPass : styles.validationFail}>
          {rules.upper ? "✓" : "•"} One uppercase letter
        </li>
        <li className={rules.number ? styles.validationPass : styles.validationFail}>
          {rules.number ? "✓" : "•"} One number
        </li>
        <li className={rules.special ? styles.validationPass : styles.validationFail}>
          {rules.special ? "✓" : "•"} One special character
        </li>
        <li className={matchOk ? styles.validationPass : styles.validationFail}>
          {matchOk ? "✓" : "•"} New Password and Confirm match
        </li>
      </ul>
    </div>
  );
}

// --- VIN helpers: ISO-3779 check-digit ---
const VIN_CHARSET = /^[A-HJ-NPR-Z0-9]{17}$/i; // disallow I, O, Q
const VIN_TRANS = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9,
  0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9
};
const VIN_WEIGHTS = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];

export function validateVIN(vinRaw) {
  const vin = (vinRaw || "").toUpperCase().trim();
  const errors = [];

  if (vin.length !== 17) errors.push("VIN must be exactly 17 characters.");
  if (!VIN_CHARSET.test(vin)) errors.push("VIN can contain A–H, J–N, P, R–Z and 0–9 only (no I, O, or Q).");

  if (errors.length === 0) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const ch = vin[i];
      const val = VIN_TRANS[ch];
      const w = VIN_WEIGHTS[i];
      if (val === undefined) {
        errors.push("VIN contains invalid characters (I, O, or Q).");
        break;
      }
      sum += val * w;
    }
    const remainder = sum % 11;
    const expected = remainder === 10 ? "X" : String(remainder);
    if (vin[8] !== expected) {
      errors.push(`Please enter a valid VIN`);
    }
  }

  return { ok: errors.length === 0, errors };
}
