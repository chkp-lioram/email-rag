# Example Queries and Outputs

1. "Show me emails with urgent payment requests from external senders"

```
Output:

[1] Email ID: email-1765148178158-78-5ul3xg
    Confidence: 92.0%
    From: Executive Office <executive@gmail.com>
    Subject: Urgent payment authorization needed (Director)
    Date: 11/29/2025, 10:02:14 AM
    Explanation: External sender (gmail) requests urgent wire transfer and includes confidential language with an executable-looking attachment.
    Threat Indicators: - external sender (gmail.com) - urgent/payment must be done quickly - wire transfer request - confidential/keep discreet - attachment with executable extension (.scr)

[2] Email ID: email-1765148178157-71-jjve7
    Confidence: 90.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Quick cash transfer needed – CFO
    Date: 12/1/2025, 7:43:25 AM
    Explanation: External sender (yahoo) requests urgent wire transfer; attachment indicates potential malware (exe) and content emphasizes discretion.
    Threat Indicators: - external sender (yahoo.com) - urgent payment request - wire transfer - attachment.exe - confidential/discreet handling - training note present

[3] Email ID: email-1765148178158-76-8bw94o
    Confidence: 90.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Immediate action required – wire transfer (CEO)
    Date: 11/27/2025, 5:38:27 AM
    Explanation: External sender (gmail) requests immediate wire transfer; content indicates training and will require final authorization via secure channel.
    Threat Indicators: - external sender (gmail.com) - urgent/payment request - wire transfer - training note present - final authorization via secure channel

[4] Email ID: email-1765148178158-75-byji0k
    Confidence: 88.0%
    From: Michael Brown (Director) <michael@yahoo.com>
    Subject: Urgent vendor payment – Director (Finance)
    Date: 11/24/2025, 2:21:00 PM
    Explanation: External sender (yahoo) requests urgent vendor payment; content marked as training.
    Threat Indicators: - external sender (yahoo.com) - urgent payment request - wire transfer - training note present - confidential

[5] Email ID: email-1765148178157-70-tbwijg
    Confidence: 85.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Urgent: Immediate vendor payment required (CEO)
    Date: 11/13/2025, 5:05:15 AM
    Explanation: External sender (yahoo) issues an urgent payment request; content appears to be a simulated training email.
    Threat Indicators: - external sender (yahoo.com) - urgent payment request - wire transfer - training note present

[6] Email ID: email-1765148178158-79-aivpv
    Confidence: 85.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Time-sensitive vendor payment (CEO)
    Date: 12/1/2025, 4:57:22 AM
    Explanation: External sender (gmail) issues an urgent payment request; marked as simulated training.
    Threat Indicators: - external sender (gmail.com) - urgent payment request - training note present

[7] Email ID: email-1765148178158-77-9toj15
    Confidence: 84.0%
    From: Sarah Johnson (CFO) <sarah@yahoo.com>
    Subject: Quick funds request (CFO)
    Date: 11/30/2025, 12:39:34 AM
    Explanation: External sender (yahoo) requests urgent funds; content labeled as training.
    Threat Indicators: - external sender (yahoo.com) - urgent payment request - training note present

[8] Email ID: email-1765148178158-74-f4xw40g
    Confidence: 83.0%
    From: Michael Brown (Director) <michael@gmail.com>
    Subject: Fast payment needed – CFO
    Date: 12/6/2025, 12:48:24 AM
    Explanation: External sender (gmail) asks for fast payment; attachment indicates potential malware and content is training.
    Threat Indicators: - external sender (gmail.com) - urgent payment request - attachment.exe - training note present

[9] Email ID: email-1765148178157-72-d1tzaj
    Confidence: 82.0%
    From: Sarah Johnson (CFO) <sarah@outlook.com>
    Subject: Immediate finance action requested (Director of Finance)
    Date: 11/15/2025, 8:32:06 PM
    Explanation: External sender (outlook) requests immediate payment; content noted as simulated training.
    Threat Indicators: - external sender (outlook.com) - urgent payment request - training note present - confidential/within approved channels
```

2. "Find emails with suspicious attachment names"

```
Output:

[1] Email ID: email-1765148275355-98-m4dvaa
    Confidence: 95.0%
    From: Security Alert <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: PASSWORD RESET REQUIRED IMMEDIATELY
    Date: 11/24/2025, 6:01:13 AM
    Explanation: Attachment payment.pdf.exe (disguised executable) highly suspicious.
    Threat Indicators: - attachment: payment.pdf.exe (executable disguised as PDF) - urgent action requirement - links to suspicious domains

[2] Email ID: email-1765148275354-92-frv08
    Confidence: 92.0%
    From: System Administrator <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: URGENT SECURITY VERIFICATION NEEDED WITHIN MINUTES
    Date: 11/19/2025, 10:40:44 AM
    Explanation: Attachment named invoice.exe (executable) present.
    Threat Indicators: - attachment: invoice.exe (executable) - urgent action language in body - references suspicious URLs

[3] Email ID: email-1765148275355-95-rk5vo4
    Confidence: 92.0%
    From: System Administrator <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: IMMEDIATE ACTION REQUIRED — SECURITY POLICY UPDATE
    Date: 11/28/2025, 3:26:27 AM
    Explanation: Attachment important.scr (suspicious Windows script/screensaver) present.
    Threat Indicators: - attachment: important.scr (.scr extension) - urgent action prompt - links to suspicious URLs

[4] Email ID: email-1765148137974-63-tm6f2q
    Confidence: 90.0%
    From: Help Desk <elevation@account-verify.net>
    Subject: Unusual activity detected – verify now
    Date: 11/29/2025, 11:17:30 PM
    Explanation: Attachment urgent_file.js (script) present.
    Threat Indicators: - attachment: urgent_file.js (script) - urgent verification request - link to a suspicious domain

[5] Email ID: email-1765148275355-96-gm5yi
    Confidence: 90.0%
    From: Security Alert <noreply@urgent-notice.org>
    Subject: SAMPLE TRAINING: URGENT NOTICE — UNUSUAL ACTIVITY DETECTED
    Date: 11/27/2025, 2:07:30 PM
    Explanation: Attachment not shown here, but body references urgent action and uses phishing cues; if there is an attached zip, it could be suspicious. (Attachment listed as document.zip in this email).
    Threat Indicators: - attachment: document.zip (potentially risky archive) - urgent action language - references suspicious links
```

3. "Identify emails that impersonate executives"

```
Output:
   [1] Email ID: email-1765148178157-71-jjve7
    Confidence: 88.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Quick cash transfer needed – CFO
    Date: 12/1/2025, 7:43:25 AM
    Explanation: Executive impersonation: CEO appears to instruct a quick cash transfer; includes an executable attachment (invoice.exe) from a personal domain.
    Threat Indicators: - Executive impersonation (CEO) - Urgent wire transfer - Suspicious attachment (invoice.exe) - Non-corporate sender domain (yahoo.com)

[2] Email ID: email-1765148178157-70-tbwijg
    Confidence: 87.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Urgent: Immediate vendor payment required (CEO)
    Date: 11/13/2025, 5:05:15 AM
    Explanation: CEO impersonation: urgent vendor payment; sender uses a non-corporate domain and a training disclaimer.
    Threat Indicators: - Executive impersonation (CEO) - Urgent wire transfer - Training disclaimer present - Non-corporate sender domain (yahoo.com)

[3] Email ID: email-1765148178158-76-8bw94o
    Confidence: 85.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Immediate action required – wire transfer (CEO)
    Date: 11/27/2025, 5:38:27 AM
    Explanation: Executive impersonation: CEO John Smith requests an urgent wire transfer; sender uses a generic email domain and an opaque attachment (important.scr).
    Threat Indicators: - Executive impersonation (CEO) - Urgent wire transfer request - Suspicious attachment (important.scr) - Non-corporate sender domain (gmail.com)

[4] Email ID: email-1765148178158-78-5ul3xg
    Confidence: 83.0%
    From: Executive Office <executive@gmail.com>
    Subject: Urgent payment authorization needed (Director)
    Date: 11/29/2025, 10:02:14 AM
    Explanation: Impersonation of a Director by an 'Executive Office' sender; urgent payment request with attachment.
    Threat Indicators: - Executive impersonation (Director) - Urgent payment request - Suspicious attachment (important.scr) - Non-corporate sender domain (gmail.com)

[5] Email ID: email-1765148178158-73-wqxal
    Confidence: 82.0%
    From: Michael Brown (Director) <michael@outlook.com>
    Subject: Urgent wiring instruction (CEO)
    Date: 12/2/2025, 12:25:49 AM
    Explanation: Impersonation of CEO via a Director-signed message; urgent wiring instruction with a suspicious attachment (important.scr).
    Threat Indicators: - Executive impersonation (Director posing as CEO) - Urgent wire transfer - Suspicious attachment (important.scr) - Non-corporate sender domain (outlook.com)

[6] Email ID: email-1765148178158-79-aivpv
    Confidence: 80.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Time-sensitive vendor payment (CEO)
    Date: 12/1/2025, 4:57:22 AM
    Explanation: CEO impersonation: time-sensitive vendor payment request; training note included.
    Threat Indicators: - Executive impersonation (CEO) - Urgent payment request - Training disclaimer present - Non-corporate sender domain (gmail.com)

[7] Email ID: email-1765148178158-74-f4xw40g
    Confidence: 79.0%
    From: Michael Brown (Director) <michael@gmail.com>
    Subject: Fast payment needed – CFO
    Date: 12/6/2025, 12:48:24 AM
    Explanation: Director-level impersonation: urgent payment instruction attributed to CFO; training disclaimer present.
    Threat Indicators: - Executive impersonation (Director) - Urgent payment request - Training disclaimer present - Non-corporate sender domain (gmail.com)
```

4. "Show emails requesting password resets"

```
Output:
[1] Email ID: email-1765148137973-61-j6k13
    Confidence: 92.0%
    From: IT Support <asset@security-alert.org>
    Subject: Immediate Action Required: Password Reset
    Date: 11/8/2025, 12:58:24 AM
    Explanation: Explicit password reset request with a verification link on a suspicious domain; potential compromise lure.
    Threat Indicators:
      - urgent language
      - password reset request
      - verification link to suspicious domain

[2] Email ID: email-1765148137974-66-rln2wd
    Confidence: 88.0%
    From: IT Support <tomatillo@account-verify.net>
    Subject: Action required: Verify your email protection
    Date: 12/4/2025, 1:31:30 AM
    Explanation: Verification link to a suspicious domain and an option to reset password indicate phishing.
    Threat Indicators:
      - suspicious domain in verification link
      - password reset option
      - potential vulnerability alert

[3] Email ID: email-1765148137974-67-d69xb9
    Confidence: 87.0%
    From: Help Desk <confusion@account-verify.net>
    Subject: Notification: Login attempt from new device
    Date: 11/30/2025, 7:50:53 AM
    Explanation: Login attempt notification directing to a verification link on a suspicious domain with an optional password reset.
    Threat Indicators:
      - login attempt from new device
      - verification link to suspicious domain
      - password reset option

[4] Email ID: email-1765148137942-60-o59f9r
    Confidence: 86.0%
    From: IT Support <pile@secure-login.com>
    Subject: Urgent Security Alert: Verify Your Account Now
    Date: 12/5/2025, 6:01:38 AM
    Explanation: Urgent verification request with a link to a suspicious domain; mentions password reset as a potential step.
    Threat Indicators:
      - urgent language
      - verification link to suspicious domain
      - password reset may be required

[5] Email ID: email-1765148137974-63-tm6f2q
    Confidence: 86.0%
    From: Help Desk <elevation@account-verify.net>
    Subject: Unusual activity detected – verify now
    Date: 11/29/2025, 11:17:30 PM
    Explanation: Unusual sign-in detected and a verification link to a suspicious domain; password reset offered as alternative.
    Threat Indicators:
      - unusual sign-in
      - verification link to suspicious domain
      - password reset alternative

[6] Email ID: email-1765148137974-65-ftl7tc
    Confidence: 85.0%
    From: Help Desk <obesity@secure-login.com>
    Subject: Suspicious activity flagged in your security settings
    Date: 11/18/2025, 10:36:18 PM
    Explanation: Security alert urging verification with a password reset option if needed; uses unknown/untrusted domain patterns.
    Threat Indicators:
      - unknown device
      - verify now
      - suspicious domain links
      - password reset option

[7] Email ID: email-1765148275355-98-m4dvaa
    Confidence: 78.0%
    From: Security Alert <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: PASSWORD RESET REQUIRED IMMEDIATELY
    Date: 11/24/2025, 6:01:13 AM
    Explanation: Urgent password reset language paired with suspicious links and an executable attachment indicate a phishing attempt.
    Threat Indicators:
      - urgent language
      - password reset request
      - suspicious links
      - attachment exe
      - suspicious sender domain
```

5. "Find emails with mismatched sender names and domains"

```
Output:
[1] Email ID: email-1765148178157-71-jjve7
    Confidence: 85.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Quick cash transfer needed – CFO
    Date: 12/1/2025, 7:43:25 AM
    Explanation: From name implies a CEO, but the sending address is a generic Yahoo domain, which is a classic mismatch for executive-level requests. The email also urges a large wire transfer and contains a suspicious attachment (invoice.exe).
    Threat Indicators:
      - mismatched sender domain
      - impersonation (CEO)
      - urgent financial request
      - suspicious attachment (invoice.exe)
```

6. "List emails containing external links"

```
Output:
[1] Email ID: email-1765148275355-98-m4dvaa
    Confidence: 94.0%
    From: Security Alert <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: PASSWORD RESET REQUIRED IMMEDIATELY
    Date: 11/24/2025, 6:01:13 AM
    Explanation: Password reset required immediately with external links and an executable attachment; classic phishing pattern in training.
    Threat Indicators:
      - urgent password reset
      - external links to unfamiliar domains
      - attachment: .exe
      - instruction to verify through official channels (red flag in training context)

[2] Email ID: email-1765148275354-93-sjyvnm
    Confidence: 93.0%
    From: Security Alert <noreply@urgent-notice.org>
    Subject: SAMPLE TRAINING: CRITICAL ACCOUNT REVIEW — TIME-SENSITIVE
    Date: 11/28/2025, 1:06:37 AM
    Explanation: Time-sensitive security alert with multiple external links and a suspicious JavaScript attachment (urgent_file.js).
    Threat Indicators:
      - time-sensitive language
      - external links to unfamiliar domains
      - attachment: .js
      - potential impersonation (Security Alert)

[3] Email ID: email-1765148137974-69-90hvz9
    Confidence: 93.0%
    From: Security Team <retention@security-alert.org>
    Subject: Final warning: urgent account verification required
    Date: 11/27/2025, 1:42:09 PM
    Explanation: Final warning to verify account with external links in a training scenario; multiple indicators of phishing.
    Threat Indicators:
      - final warning
      - external links to unfamiliar domains
      - suspicious domain usage
      - training context explicitly describes phishing patterns

[4] Email ID: email-1765148275354-92-frv08
    Confidence: 92.0%
    From: System Administrator <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: URGENT SECURITY VERIFICATION NEEDED WITHIN MINUTES
    Date: 11/19/2025, 10:40:44 AM
    Explanation: Contains urgent verification request with minutes-level urgency and external links to unfamiliar domains, plus an executable attachment typical of phishing simulations.
    Threat Indicators:
      - urgency language
      - external links to unfamiliar domains
      - attachment: .exe
      - potential impersonation (System Administrator)

[5] Email ID: email-1765148275355-95-rk5vo4
    Confidence: 92.0%
    From: System Administrator <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: IMMEDIATE ACTION REQUIRED — SECURITY POLICY UPDATE
    Date: 11/28/2025, 3:26:27 AM
    Explanation: Immediated security policy update with external links and a suspicious attachment; training example of scam cues.
    Threat Indicators:
      - urgency language
      - external links to unfamiliar domains
      - attachment: .scr
      - suspicious sender formatting

[6] Email ID: email-1765148275355-99-xahrrk
    Confidence: 91.0%
    From: Service Team <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: ACTION REQUIRED IN 5 MINUTES TO AVOID SUSPENSION
    Date: 11/15/2025, 1:40:40 AM
    Explanation: Urgent action deadline (5 minutes) with external links and a zipped attachment, typical phishing/attack-pattern training.
    Threat Indicators:
      - time pressure
      - external links to unfamiliar domains
      - attachment: .zip
      - suspicious sender details

[7] Email ID: email-1765148275355-96-gm5yi
    Confidence: 91.0%
    From: Security Alert <noreply@urgent-notice.org>
    Subject: SAMPLE TRAINING: URGENT NOTICE — UNUSUAL ACTIVITY DETECTED
    Date: 11/27/2025, 2:07:30 PM
    Explanation: Urgent notice with external links; training scenario that emphasizes phishing cues.
    Threat Indicators:
      - urgent language
      - external links to unfamiliar domains
      - implicit phishing training context

[8] Email ID: email-1765148275353-90-3uz7je
    Confidence: 90.0%
    From: Service Team <noreply@account-services.net>
    Subject: SAMPLE TRAINING: IMMEDIATE ACTION REQUIRED TO PROTECT YOUR ACCOUNT
    Date: 11/18/2025, 4:30:40 PM
    Explanation: Urgent action prompt with external links and an unusual attachment (.scr) used in phishing simulations.
    Threat Indicators:
      - urgency language
      - external links to unfamiliar domains
      - attachment: .scr
      - training context implying attack patterns

[9] Email ID: email-1765148275354-94-imgw5w
    Confidence: 89.0%
    From: Security Alert <noreply@urgent-notice.org>
    Subject: SAMPLE TRAINING: FINAL WARNING — SUSPENSION IF DELAY CONTINUES
    Date: 11/10/2025, 5:50:16 PM
    Explanation: Final warning about suspension with links to suspicious domains; standard phishing-pattern indicators.
    Threat Indicators:
      - final warning
      - external links to unfamiliar domains
      - suspicious sender details
```

7. "Show me invoice-related emails from free email providers"

```
Output:
[1] Email ID: email-1765148178157-71-jjve7
    Confidence: 93.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Quick cash transfer needed – CFO
    Date: 12/1/2025, 7:43:25 AM
    Explanation: Invoice-related topic with urgent wire transfer request coming from a free email provider (yahoo.com) and an executable attachment (invoice.exe). Also uses impersonation (CEO) and discreet instruction, typical phishing indicators.
    Threat Indicators:
      - Urgent/grab-forces action
      - From free email provider (yahoo.com)
      - Impersonation (CEO)
      - Suspicious attachment (invoice.exe)
      - Wire transfer request
      - Simulated training message (potential misleading context)
```

8. "Find emails with urgency language"

```
Output:
[1] Email ID: email-1765148275355-99-xahrrk
    Confidence: 93.0%
    From: Service Team <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: ACTION REQUIRED IN 5 MINUTES TO AVOID SUSPENSION
    Date: 11/15/2025, 1:40:40 AM
    Explanation: Urgency is explicit (5 minutes to avoid suspension) with references to dubious domains; contains a suspicious archive attachment (document.zip).
    Threat Indicators:
      - urgency language
      - deadline pressure
      - suspicious links
      - suspicious attachment (document.zip)

[2] Email ID: email-1765148275354-93-sjyvnm
    Confidence: 92.0%
    From: Security Alert <noreply@urgent-notice.org>
    Subject: SAMPLE TRAINING: CRITICAL ACCOUNT REVIEW — TIME-SENSITIVE
    Date: 11/28/2025, 1:06:37 AM
    Explanation: Contains explicit urgency language (URGENT, time is short) and prompts to visit external login pages; includes an executable-like attachment. Training context but threat-pattern evident.
    Threat Indicators:
      - urgency language
      - time-sensitive / deadline pressure
      - suspicious external links
      - attachment with .js/.exe-like extension
      - potential impersonation / spoofed sender

[3] Email ID: email-1765148275354-92-frv08
    Confidence: 92.0%
    From: System Administrator <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: URGENT SECURITY VERIFICATION NEEDED WITHIN MINUTES
    Date: 11/19/2025, 10:40:44 AM
    Explanation: Urgent verification requested within minutes; includes URLs to known phishing-style domains; executable attachment (invoice.exe).
    Threat Indicators:
      - urgency language
      - time-bound verification request
      - suspicious links
      - attachment with .exe extension

[4] Email ID: email-1765148178158-73-wqxal
    Confidence: 90.0%
    From: Michael Brown (Director) <michael@outlook.com>
    Subject: Urgent wiring instruction (CEO)
    Date: 12/2/2025, 12:25:49 AM
    Explanation: Urgent money transfer request stated as a CEO-level instruction; immediate action requested; contains executable-style attachment (important.scr).
    Threat Indicators:
      - urgent money transfer request
      - immediate action requested
      - attachment with .scr extension
      - executive impersonation risk

[5] Email ID: email-1765148178158-78-5ul3xg
    Confidence: 90.0%
    From: Executive Office <executive@gmail.com>
    Subject: Urgent payment authorization needed (Director)
    Date: 11/29/2025, 10:02:14 AM
    Explanation: Urgent payment authorization request; wire transfer; includes executable-like attachment (important.scr); training context present.
    Threat Indicators:
      - urgent / payment authorization
      - wire transfer
      - attachment with .scr extension

[6] Email ID: email-1765148178157-71-jjve7
    Confidence: 89.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Quick cash transfer needed – CFO
    Date: 12/1/2025, 7:43:25 AM
    Explanation: Urgent cash transfer request attributed to CEO/CFO context; large wire amount; discreet handling urged; training context.
    Threat Indicators:
      - urgent money transfer request
      - large wire amount
      - executive-level impersonation risk
      - training context

[7] Email ID: email-1765148178158-79-aivpv
    Confidence: 88.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Time-sensitive vendor payment (CEO)
    Date: 12/1/2025, 4:57:22 AM
    Explanation: Time-sensitive payment request (wire) with emphasis on speed; sender impersonation risk (CEO signature, Gmail domain); training context present.
    Threat Indicators:
      - time-sensitive / urgency
      - wire transfer request
      - suspicious sender domain (gmail) / impersonation risk

[8] Email ID: email-1765148275355-95-rk5vo4
    Confidence: 87.0%
    From: System Administrator <noreply@system-alert.com>
    Subject: SAMPLE TRAINING: IMMEDIATE ACTION REQUIRED — SECURITY POLICY UPDATE
    Date: 11/28/2025, 3:26:27 AM
    Explanation: Immediate action required for security policy update; urgency language; references to external URLs; executable-like attachment.
    Threat Indicators:
      - URGENT / immediate action
      - links to external domains
      - attachment with .scr/.exe-like extension

[9] Email ID: email-1765148178157-70-tbwijg
    Confidence: 87.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Urgent: Immediate vendor payment required (CEO)
    Date: 11/13/2025, 5:05:15 AM
    Explanation: Urgent vendor payment request from CEO context; time pressure to issue a wire; confidential handling emphasized.
    Threat Indicators:
      - urgent / immediate payment
      - wire transfer
      - executive impersonation risk

[10] Email ID: email-1765148178158-75-byji0k
    Confidence: 86.0%
    From: Michael Brown (Director) <michael@yahoo.com>
    Subject: Urgent vendor payment – Director (Finance)
    Date: 11/24/2025, 2:21:00 PM
    Explanation: Urgent vendor payment request with time sensitivity; wires requested; training note present; potential impersonation risk due to executive-level sender.
    Threat Indicators:
      - urgent vendor payment
      - wire transfer
      - executive impersonation risk
```

9. "Identify potential credential harvesting attempts"

```
Output:
[1] Email ID: email-1765148137974-67-d69xb9
    Confidence: 93.0%
    From: Help Desk <confusion@account-verify.net>
    Subject: Notification: Login attempt from new device
    Date: 11/30/2025, 7:50:53 AM
    Explanation: Login attempt notification with verification link to a suspicious domain and an malicious attachment; strong credential harvesting indicators.
    Threat Indicators:
      - suspicious link to suspicious-domain.com/verify
      - attachment: payment.pdf.exe
      - new device login attempt
      - password reset option

[2] Email ID: email-1765148137974-63-tm6f2q
    Confidence: 92.0%
    From: Help Desk <elevation@account-verify.net>
    Subject: Unusual activity detected – verify now
    Date: 11/29/2025, 11:17:30 PM
    Explanation: Phishing attempt targeting credentials: urgent verification request, password reset option, and a link to a suspicious domain; includes a suspicious attachment.
    Threat Indicators:
      - urgent verification request
      - password reset option
      - verification link to suspicious-domain.com
      - attachment: urgent_file.js
      - suspicious sender domain

[3] Email ID: email-1765148137942-60-o59f9r
    Confidence: 90.0%
    From: IT Support <pile@secure-login.com>
    Subject: Urgent Security Alert: Verify Your Account Now
    Date: 12/5/2025, 6:01:38 AM
    Explanation: Urgent security verification lure with link to suspicious domain; typical phishing pattern aimed at credential collection.
    Threat Indicators:
      - urgent language
      - verification link to suspicious-domain.com/verify
      - new device indicator
      - credential harvesting attempt

[4] Email ID: email-1765148137973-61-j6k13
    Confidence: 88.0%
    From: IT Support <asset@security-alert.org>
    Subject: Immediate Action Required: Password Reset
    Date: 11/8/2025, 12:58:24 AM
    Explanation: Credential harvesting attempt: urgent password reset request with verification link to a suspicious domain.
    Threat Indicators:
      - urgent/Immediate action
      - password reset request
      - verification link to suspicious-domain.com
      - potential credential harvesting
```

10. "Show emails sent outside business hours"

```
Output:
[1] Email ID: email-1765148178158-76-8bw94o
    Confidence: 94.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Immediate action required – wire transfer (CEO)
    Date: 11/27/2025, 5:38:27 AM
    Explanation: Outside business hours with CEO impersonation and a suspicious script attachment for a wire transfer.
    Threat Indicators:
      - CEO impersonation
      - suspicious attachment .scr
      - urgent wire transfer
      - outside business hours

[2] Email ID: email-1765148178157-71-jjve7
    Confidence: 93.0%
    From: John Smith (CEO) <john@yahoo.com>
    Subject: Quick cash transfer needed – CFO
    Date: 12/1/2025, 7:43:25 AM
    Explanation: Outside business hours with CFO/CEO impersonation and a suspicious executable attachment for a wire transfer.
    Threat Indicators:
      - CEO impersonation
      - suspicious attachment .exe
      - urgent wire transfer request
      - outside business hours
      - simulated training content

[3] Email ID: email-1765148178158-73-wqxal
    Confidence: 93.0%
    From: Michael Brown (Director) <michael@outlook.com>
    Subject: Urgent wiring instruction (CEO)
    Date: 12/2/2025, 12:25:49 AM
    Explanation: Outside business hours with CEO impersonation and a suspicious script attachment for a wiring instruction.
    Threat Indicators:
      - CEO impersonation
      - suspicious attachment .scr
      - urgent wiring instruction
      - outside business hours
      - simulated training content

[4] Email ID: email-1765148178158-79-aivpv
    Confidence: 92.0%
    From: John Smith (CEO) <john@gmail.com>
    Subject: Time-sensitive vendor payment (CEO)
    Date: 12/1/2025, 4:57:22 AM
    Explanation: Outside business hours with CEO impersonation and urgent payment request from a personal email address.
    Threat Indicators:
      - CEO impersonation
      - urgent payment request
      - external personal email (gmail.com)
      - simulated training content
```
