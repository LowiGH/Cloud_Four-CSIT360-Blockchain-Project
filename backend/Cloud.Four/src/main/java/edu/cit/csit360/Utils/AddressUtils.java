package edu.cit.csit360.Utils;

public class AddressUtils {
    // Very small normalization helper: trim, toLowerCase, remove surrounding whitespace
    // and canonicalize bech32 prefixes to a stable lower-case representation.
    public static String normalize(String addr) {
        if (addr == null) return null;
        addr = addr.trim();
        if (addr.isEmpty()) return null;
        // Lowercase everything for canonical compare
        String low = addr.toLowerCase();
        // Remove whitespace inside (just in case)
        low = low.replaceAll("\\s+", "");
        return low;
    }

    // Rough detection: bech32 addresses typically start with addr or addr_test or stake
    public static boolean looksLikeBech32(String addr) {
        if (addr == null) return false;
        String a = addr.toLowerCase();
        return a.startsWith("addr") || a.startsWith("stake") || a.startsWith("addr_test");
    }

    // Rough detection for hex (hex string of some length)
    public static boolean looksLikeHex(String addr) {
        if (addr == null) return false;
        String a = addr.replaceAll("^0x", "");
        return a.matches("[0-9a-fA-F]{40,}");
    }
}
