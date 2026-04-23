# -*- coding: utf-8 -*-
import sys, io
# Force UTF-8 output on Windows so Unicode symbols display correctly
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

"""
=============================================================
validate.py -- XML Validation Script
Library Management System: Validates XML against DTD and XSD

Requirements:
    pip install lxml

Usage:
    python validate.py
=============================================================
"""

import sys
from pathlib import Path

try:
    from lxml import etree
except ImportError:
    print("❌  lxml is not installed. Run: pip install lxml")
    sys.exit(1)


# ─── Colour helpers ──────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"


def header(title: str) -> None:
    print(f"\n{BOLD}{CYAN}{'=' * 60}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{'=' * 60}{RESET}")


def ok(msg: str) -> None:
    print(f"  {GREEN}[PASS]  {msg}{RESET}")


def fail(msg: str) -> None:
    print(f"  {RED}[FAIL]  {msg}{RESET}")


def info(msg: str) -> None:
    print(f"  {YELLOW}[INFO]  {msg}{RESET}")


# ─── DTD Validation ──────────────────────────────────────────────────────────
def validate_dtd(xml_path: Path, dtd_path: Path) -> bool:
    """Validate an XML file against a DTD. Returns True if valid."""
    label = xml_path.name
    try:
        with open(dtd_path, "rb") as f:
            dtd = etree.DTD(f)

        tree = etree.parse(str(xml_path))
        root = tree.getroot()

        if dtd.validate(root):
            ok(f"DTD validation PASSED  →  {label}")
            return True
        else:
            fail(f"DTD validation FAILED  →  {label}")
            for error in dtd.error_log.filter_from_errors():
                print(f"     {RED}Line {error.line}: {error.message}{RESET}")
            return False

    except etree.XMLSyntaxError as exc:
        fail(f"XML is not well-formed  →  {label}")
        print(f"     {RED}{exc}{RESET}")
        return False
    except Exception as exc:
        fail(f"Unexpected error  →  {label}: {exc}")
        return False


# ─── XSD Validation ──────────────────────────────────────────────────────────
def validate_xsd(xml_path: Path, xsd_path: Path) -> bool:
    """Validate an XML file against an XSD schema. Returns True if valid."""
    label = xml_path.name
    try:
        schema_doc = etree.parse(str(xsd_path))
        schema = etree.XMLSchema(schema_doc)

        xml_doc = etree.parse(str(xml_path))

        if schema.validate(xml_doc):
            ok(f"XSD validation PASSED  →  {label}")
            return True
        else:
            fail(f"XSD validation FAILED  →  {label}")
            for error in schema.error_log:
                print(f"     {RED}Line {error.line}: {error.message}{RESET}")
            return False

    except etree.XMLSyntaxError as exc:
        fail(f"XML is not well-formed  →  {label}")
        print(f"     {RED}{exc}{RESET}")
        return False
    except Exception as exc:
        fail(f"Unexpected error  →  {label}: {exc}")
        return False


# ─── Main ────────────────────────────────────────────────────────────────────
def main() -> None:
    base = Path(__file__).parent

    valid_xml       = base / "library.xml"
    dtd_file        = base / "library.dtd"
    xsd_file        = base / "library.xsd"
    invalid_dtd_xml = base / "library_invalid_dtd.xml"
    invalid_xsd_xml = base / "library_invalid_xsd.xml"

    # ── Check all files exist ──
    missing = [f for f in [valid_xml, dtd_file, xsd_file,
                            invalid_dtd_xml, invalid_xsd_xml]
               if not f.exists()]
    if missing:
        for m in missing:
            fail(f"Missing file: {m}")
        sys.exit(1)

    # ═══════════════════════════════════════════════
    #  1.  VALID XML  —  should pass both validators
    # ═══════════════════════════════════════════════
    header("TEST 1 -- Valid XML vs DTD  (should PASS)")
    validate_dtd(valid_xml, dtd_file)

    header("TEST 2 -- Valid XML vs XSD  (should PASS)")
    validate_xsd(valid_xml, xsd_file)

    # =====================================================
    #  2.  INVALID DTD XML  --  should fail DTD
    # =====================================================
    header("TEST 3 -- Invalid DTD XML vs DTD  (should FAIL)")
    info("Violation: missing required <isbn> element inside <book>")
    validate_dtd(invalid_dtd_xml, dtd_file)

    # =====================================================
    #  3.  INVALID XSD XML  --  should fail XSD
    # =====================================================
    header("TEST 4 -- Invalid XSD XML vs XSD  (should FAIL)")
    info("Violations: bad enum value, year>2026, negative pages,")
    info("            malformed email, bad zip, lowercase currency")
    validate_xsd(invalid_xsd_xml, xsd_file)

    print(f"\n{BOLD}{'-' * 60}{RESET}")
    print(f"{BOLD}  All tests complete.{RESET}\n")


if __name__ == "__main__":
    main()
