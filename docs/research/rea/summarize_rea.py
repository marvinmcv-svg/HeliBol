#!/usr/bin/env python3
"""Summarize REA `analyze-javascript-application` Evidence files.

Usage: python3 summarize_rea.py evidence1.json [evidence2.json ...] > summary.json
For each library: REA statistics, routes, external packages (ranked by number of
importing edges) and which motion/3D engines the codebase depends on.
"""
import collections, json, sys

ENGINES = {
    "motion": ("motion", "framer-motion", "motion/react"),
    "gsap": ("gsap", "@gsap/react"),
    "three/r3f": ("three", "@react-three/fiber", "@react-three/drei", "ogl", "postprocessing"),
    "lenis": ("lenis", "@studio-freight/lenis"),
    "lottie/rive": ("lottie-react", "@lottiefiles/dotlottie-react", "@rive-app/react-canvas"),
    "canvas/webgl": ("ogl", "matter-js", "cobe", "canvas-confetti", "tsparticles", "@tsparticles/react"),
    "radix/shadcn": ("@radix-ui/", "radix-ui", "cmdk", "vaul", "sonner"),
}


VALID = __import__("re").compile(r"^(@[a-z0-9][\w.-]*/)?[a-z0-9][\w.-]*(/[\w./-]*)?$")
LOCAL_ROOTS = {"apps", "packages", "src", "components", "lib", "registry"}


def pkg_name(spec: str) -> str | None:
    if not VALID.match(spec) or spec.split("/")[0] in LOCAL_ROOTS:
        return None
    if spec.startswith((".", "/", "@/", "~/", "#")) or spec.startswith("node:"):
        return None
    parts = spec.split("/")
    return "/".join(parts[:2]) if spec.startswith("@") else parts[0]


def summarize(path: str) -> dict:
    d = json.load(open(path))
    nr = d["normalized_result"]
    nodes = nr["graph"]["nodes"]
    incoming = collections.Counter(e.get("target_node_id") for e in nr["graph"]["edges"])
    pkgs = collections.Counter()
    for n in nodes:
        if n.get("kind") != "javascript-module":
            continue
        key = n["identity"].get("key", "")
        if ":" not in key:
            continue
        spec = key.split(":", 1)[1]
        name = pkg_name(spec)
        if name:
            pkgs[name] += max(1, incoming.get(n["node_id"], 0))
    engines = {
        e: sum(c for p, c in pkgs.items() if any(p == m or p.startswith(m) for m in mods))
        for e, mods in ENGINES.items()
    }
    routes = sorted({r.get("path") for r in nr.get("route_inventory", {}).get("routes", []) if r.get("path")})
    s = nr["statistics"]
    return {
        "artifact": nr["input_path"].rstrip("/").split("/")[-1],
        "evidence_id": d.get("evidence_id"),
        "files_parsed": s.get("parsed_javascript_files"),
        "ast_nodes": s.get("visited_ast_nodes"),
        "findings": s.get("findings"),
        "graph_nodes": len(nodes),
        "routes": routes,
        "engine_import_edges": engines,
        "top_packages": pkgs.most_common(25),
    }


if __name__ == "__main__":
    json.dump([summarize(p) for p in sys.argv[1:]], sys.stdout, indent=2)
