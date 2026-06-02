export type Level = "Débutant" | "Intermédiaire" | "Avancé";

export type CategorySlug =
  | "cyber-cli"
  | "osint-recon"
  | "network-diag"
  | "forensic-ir"
  | "malware-re"
  | "sysadmin"
  | "devops-cloud"
  | "devprod"
  | "databases-data"
  | "blueteam";

export type OS = "Linux" | "Windows" | "macOS";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  icon: string;
  accent: "blue" | "violet" | "cyan" | "emerald" | "amber" | "coral" | "magenta";
}

export interface Tool {
  slug: string;
  name: string;
  category: CategorySlug;
  short: string;
  utility: string;
  description: string;
  install: string;
  command: string;
  os: OS[];
  useCases: string[];
  pros: string[];
  limits: string[];
  level: Level;
  tags: string[];
  github: string;
  alternatives: string[];
  ethical?: boolean;
  popular?: boolean;
  recent?: boolean;
  featured?: boolean;
}

export const ETHICAL_NOTICE =
  "À utiliser uniquement sur vos propres systèmes, en laboratoire ou avec autorisation écrite explicite du propriétaire.";

export const categories: Category[] = [
  { slug: "cyber-cli", name: "Cybersecurity CLI", short: "Pentest autorisé, audit web et réseau", description: "Scanners, fuzzers, frameworks d'audit et d'exploitation utilisés en cadre légal (laboratoire, audits autorisés, bug bounty cadré).", icon: "ShieldCheck", accent: "blue" },
  { slug: "osint-recon", name: "OSINT & Recon", short: "Renseignement en sources ouvertes", description: "Énumération de sous-domaines, recherche de comptes publics, fuites Git, archives Web — uniquement à partir de données publiques.", icon: "Search", accent: "violet" },
  { slug: "network-diag", name: "Network & Diagnostics", short: "Diagnostic, capture, supervision", description: "Outils terminal pour tester la connectivité, capturer le trafic, mesurer la bande passante et configurer le réseau.", icon: "Network", accent: "cyan" },
  { slug: "forensic-ir", name: "Forensic & Incident Response", short: "Investigation numérique", description: "Analyse mémoire, file carving, timelines, audit d'intégrité — la boîte à outils CLI du DFIR.", icon: "Fingerprint", accent: "magenta" },
  { slug: "malware-re", name: "Malware Analysis & RE", short: "Reverse engineering en CLI", description: "Désassembleurs, tracers, analyseurs PE/ELF et signatures pour analyser des binaires en environnement contrôlé.", icon: "Bug", accent: "coral" },
  { slug: "sysadmin", name: "System Administration", short: "Exploitation Linux & Windows", description: "Shells, gestion de services, supervision système, sauvegardes et gestion de paquets multiplateforme.", icon: "Server", accent: "amber" },
  { slug: "devops-cloud", name: "DevOps & Cloud", short: "Conteneurs, IaC et cloud", description: "Docker, Kubernetes, Terraform, Ansible et CLI des principaux providers cloud.", icon: "Cloud", accent: "emerald" },
  { slug: "devprod", name: "Developer Productivity", short: "Recherche, parsing, qualité de code", description: "Recherche ultra-rapide, traitement texte/JSON/YAML, linters et scanners de dépendances.", icon: "Code2", accent: "blue" },
  { slug: "databases-data", name: "Databases & Data", short: "Clients SQL/NoSQL et traitement CSV", description: "Clients SQL/NoSQL en ligne de commande, dump/restore, traitement CSV/JSON et bases analytiques locales.", icon: "Database", accent: "violet" },
  { slug: "blueteam", name: "Blue Team & Monitoring", short: "Détection, IDS, audit de sécurité", description: "IDS/IPS, audit Linux, hardening, détection de rootkits et monitoring orienté sécurité défensive.", icon: "ShieldAlert", accent: "cyan" },
];

const ALL: OS[] = ["Linux", "Windows", "macOS"];
const LX: OS[] = ["Linux", "macOS"];
const LXONLY: OS[] = ["Linux"];

type O = Partial<Omit<Tool, "slug" | "name" | "category" | "short" | "command" | "github">>;
const m = (
  slug: string, name: string, category: CategorySlug, short: string,
  command: string, github: string, o: O = {}
): Tool => ({
  slug, name, category, short,
  utility: o.utility ?? short,
  description: o.description ?? o.utility ?? short,
  install: o.install ?? "# voir la documentation officielle",
  command,
  os: o.os ?? ALL,
  useCases: o.useCases ?? [],
  pros: o.pros ?? [],
  limits: o.limits ?? [],
  level: o.level ?? "Intermédiaire",
  tags: o.tags ?? [],
  github,
  alternatives: o.alternatives ?? [],
  ethical: o.ethical,
  popular: o.popular,
  recent: o.recent,
  featured: o.featured,
});

const E = { ethical: true } as const;

export const tools: Tool[] = [
  // ============== CYBERSECURITY CLI ==============
  m("nmap","Nmap","cyber-cli","Scanner réseau et découverte de services","nmap -sV 192.168.1.1","https://github.com/nmap/nmap",{install:"apt install nmap",tags:["scan","réseau","pentest"],level:"Intermédiaire",...E,popular:true,featured:true,useCases:["Inventaire réseau","Validation pare-feu","Audit interne"]}),
  m("masscan","Masscan","cyber-cli","Scan de ports ultra-rapide","masscan 10.0.0.0/24 -p80,443 --rate=1000","https://github.com/robertdavidgraham/masscan",{install:"apt install masscan",os:LX,tags:["scan","réseau"],level:"Avancé",...E}),
  m("rustscan","RustScan","cyber-cli","Scan de ports rapide avec relais Nmap","rustscan -a 192.168.1.1 -- -sV","https://github.com/RustScan/RustScan",{install:"cargo install rustscan",tags:["scan","rust"],...E,recent:true}),
  m("naabu","Naabu","cyber-cli","Scanner de ports moderne (ProjectDiscovery)","naabu -host example.com","https://github.com/projectdiscovery/naabu",{install:"go install github.com/projectdiscovery/naabu/v2/cmd/naabu@latest",tags:["scan","go"],...E}),
  m("netcat","netcat (nc)","cyber-cli","Diagnostic TCP/UDP, listeners et transferts","nc -lvnp 4444","https://github.com/diegocr/netcat",{install:"apt install netcat-openbsd",os:LX,tags:["réseau","listener"],level:"Débutant",...E,popular:true}),
  m("socat","socat","cyber-cli","Relais réseau bidirectionnel avancé","socat TCP-LISTEN:8080,fork TCP:localhost:80","http://www.dest-unreach.org/socat/",{install:"apt install socat",os:LX,tags:["réseau","tunnel"],...E}),
  m("enum4linux-ng","enum4linux-ng","cyber-cli","Énumération SMB/Windows","enum4linux-ng -A 192.168.56.10","https://github.com/cddmp/enum4linux-ng",{install:"pipx install enum4linux-ng",os:LX,tags:["SMB","AD"],...E}),
  m("smbclient","smbclient","cyber-cli","Client SMB en ligne de commande","smbclient -L //192.168.1.10 -N","https://github.com/samba-team/samba",{install:"apt install smbclient",os:LX,tags:["SMB"],level:"Débutant",...E}),
  m("netexec","NetExec (anciennement CrackMapExec)","cyber-cli","Audit d'environnements Windows autorisés","netexec smb 192.168.56.0/24 -u user -p pass","https://github.com/Pennyw0rth/NetExec",{install:"pipx install netexec",os:LX,tags:["AD","SMB","WinRM"],level:"Avancé",...E,recent:true}),
  m("impacket","Impacket","cyber-cli","Bibliothèque et outils réseau Windows","impacket-smbserver share .","https://github.com/fortra/impacket",{install:"pipx install impacket",os:LX,tags:["AD","SMB","Kerberos"],level:"Avancé",...E}),
  m("responder","Responder","cyber-cli","Analyse de protocoles réseau en laboratoire","responder -I eth0","https://github.com/lgandx/Responder",{install:"apt install responder",os:LXONLY,tags:["LLMNR","NBT-NS","lab"],level:"Avancé",...E}),
  m("evil-winrm","Evil-WinRM","cyber-cli","Administration WinRM en contexte autorisé","evil-winrm -i 10.0.0.5 -u user -p pass","https://github.com/Hackplayers/evil-winrm",{install:"gem install evil-winrm",os:LX,tags:["WinRM","Windows"],level:"Avancé",...E}),
  m("kerbrute","kerbrute","cyber-cli","Audit Kerberos en laboratoire","kerbrute userenum --dc dc.lab.local -d lab.local users.txt","https://github.com/ropnop/kerbrute",{tags:["Kerberos","AD"],level:"Avancé",...E}),
  m("ldapsearch","ldapsearch","cyber-cli","Requêtes LDAP en CLI","ldapsearch -x -H ldap://dc.lab.local -b 'dc=lab,dc=local'","https://www.openldap.org/software/",{install:"apt install ldap-utils",os:LX,tags:["LDAP"],level:"Intermédiaire"}),
  m("bloodhound-python","BloodHound.py","cyber-cli","Collecte AD pour analyse défensive","bloodhound-python -u user -p pass -d lab.local -c All","https://github.com/dirkjanm/BloodHound.py",{install:"pipx install bloodhound",os:LX,tags:["AD","graph"],level:"Avancé",...E}),
  m("mitmproxy","mitmproxy","cyber-cli","Proxy HTTP/HTTPS interactif en CLI","mitmproxy","https://github.com/mitmproxy/mitmproxy",{install:"pipx install mitmproxy",tags:["proxy","http"],...E}),
  m("testssl","testssl.sh","cyber-cli","Audit complet TLS/SSL","testssl.sh https://example.com","https://github.com/drwetter/testssl.sh",{install:"git clone https://github.com/drwetter/testssl.sh",os:LX,tags:["TLS","audit"],level:"Débutant",...E,popular:true}),
  m("sslscan","sslscan","cyber-cli","Scanner SSL/TLS","sslscan example.com","https://github.com/rbsec/sslscan",{install:"apt install sslscan",tags:["TLS"],level:"Débutant",...E}),
  m("sslyze","SSLyze","cyber-cli","Analyse TLS scriptable","sslyze --regular example.com","https://github.com/nabla-c0d3/sslyze",{install:"pipx install sslyze",tags:["TLS"],...E}),
  m("nuclei","Nuclei","cyber-cli","Scanner basé sur templates YAML","nuclei -u https://example.com -severity medium,high","https://github.com/projectdiscovery/nuclei",{install:"go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest",tags:["DAST","templates"],...E,popular:true,featured:true,recent:true}),
  m("httpx","httpx","cyber-cli","Sondeur HTTP rapide","httpx -l hosts.txt -title -status-code","https://github.com/projectdiscovery/httpx",{install:"go install github.com/projectdiscovery/httpx/cmd/httpx@latest",tags:["http","recon"],level:"Débutant",...E,recent:true}),
  m("katana","Katana","cyber-cli","Crawler web en CLI","katana -u https://example.com","https://github.com/projectdiscovery/katana",{install:"go install github.com/projectdiscovery/katana/cmd/katana@latest",tags:["crawler","web"],...E}),
  m("gau","gau","cyber-cli","Récupération d'URLs publiques archivées","gau example.com","https://github.com/lc/gau",{install:"go install github.com/lc/gau/v2/cmd/gau@latest",tags:["recon","wayback"],level:"Débutant",...E}),
  m("waybackurls","waybackurls","cyber-cli","Extraction d'URLs depuis Wayback Machine","echo example.com | waybackurls","https://github.com/tomnomnom/waybackurls",{install:"go install github.com/tomnomnom/waybackurls@latest",tags:["recon","wayback"],level:"Débutant",...E}),
  m("hakrawler","hakrawler","cyber-cli","Crawler web rapide","echo https://example.com | hakrawler","https://github.com/hakluke/hakrawler",{install:"go install github.com/hakluke/hakrawler@latest",tags:["crawler"],...E}),
  m("ffuf","ffuf","cyber-cli","Fuzzing web ultra-rapide","ffuf -u https://example.com/FUZZ -w wordlist.txt","https://github.com/ffuf/ffuf",{install:"go install github.com/ffuf/ffuf/v2@latest",tags:["fuzzing","web"],...E,popular:true}),
  m("gobuster","Gobuster","cyber-cli","Brute-force de chemins web et DNS","gobuster dir -u https://example.com -w wordlist.txt","https://github.com/OJ/gobuster",{install:"apt install gobuster",tags:["web","dns"],level:"Débutant",...E}),
  m("dirsearch","dirsearch","cyber-cli","Recherche de répertoires web","dirsearch -u https://example.com","https://github.com/maurosoria/dirsearch",{install:"pipx install dirsearch",tags:["web"],level:"Débutant",...E}),
  m("feroxbuster","feroxbuster","cyber-cli","Content discovery rapide en Rust","feroxbuster -u https://example.com","https://github.com/epi052/feroxbuster",{install:"cargo install feroxbuster",tags:["web","rust"],...E}),
  m("wfuzz","wfuzz","cyber-cli","Fuzzing web flexible","wfuzz -w wordlist.txt https://example.com/FUZZ","https://github.com/xmendez/wfuzz",{install:"pipx install wfuzz",tags:["fuzzing"],...E}),
  m("sqlmap","SQLMap","cyber-cli","Audit d'injection SQL automatisé","sqlmap -u 'https://example.com/page?id=1' --batch","https://github.com/sqlmapproject/sqlmap",{install:"pipx install sqlmap",tags:["SQLi"],level:"Avancé",...E,featured:true}),
  m("nikto","Nikto","cyber-cli","Scanner web de vulnérabilités","nikto -h https://example.com","https://github.com/sullo/nikto",{install:"apt install nikto",tags:["web","scan"],level:"Débutant",...E}),
  m("wapiti","Wapiti","cyber-cli","Scanner de sécurité web","wapiti -u https://example.com","https://github.com/wapiti-scanner/wapiti",{install:"pipx install wapiti3",tags:["web","DAST"],...E}),
  m("dalfox","Dalfox","cyber-cli","Détection de vulnérabilités XSS","dalfox url https://example.com?q=test","https://github.com/hahwul/dalfox",{install:"go install github.com/hahwul/dalfox/v2@latest",tags:["XSS","web"],...E}),
  m("arjun","Arjun","cyber-cli","Découverte de paramètres HTTP cachés","arjun -u https://example.com","https://github.com/s0md3v/Arjun",{install:"pipx install arjun",tags:["web","params"],...E}),
  m("commix","commix","cyber-cli","Audit d'injection de commandes (lab)","commix -u 'https://example.com/page?cmd=ls'","https://github.com/commixproject/commix",{install:"pipx install commix",tags:["injection"],level:"Avancé",...E}),
  m("ysoserial","ysoserial","cyber-cli","Tests Java deserialization (lab)","java -jar ysoserial.jar CommonsCollections1 'id'","https://github.com/frohoff/ysoserial",{tags:["java","deserialization"],level:"Avancé",...E}),
  m("metasploit","Metasploit Framework","cyber-cli","Framework d'audit autorisé","msfconsole -q","https://github.com/rapid7/metasploit-framework",{tags:["pentest","framework"],level:"Avancé",...E,featured:true}),
  m("searchsploit","SearchSploit","cyber-cli","Recherche d'exploits publics via Exploit-DB","searchsploit apache 2.4","https://gitlab.com/exploit-database/exploitdb",{install:"apt install exploitdb",tags:["exploit-db"],level:"Débutant",...E}),
  m("exploitdb","Exploit-DB","cyber-cli","Base de données publique d'exploits","searchsploit -m linux/local/12345.c","https://gitlab.com/exploit-database/exploitdb",{install:"apt install exploitdb",tags:["exploit-db"],...E}),
  m("hydra","Hydra","cyber-cli","Audit d'authentification réseau (lab)","hydra -L users.txt -P pass.txt 192.168.56.10 ssh","https://github.com/vanhauser-thc/thc-hydra",{install:"apt install hydra",tags:["auth"],level:"Avancé",...E}),
  m("john","John the Ripper","cyber-cli","Audit de mots de passe CPU","john --wordlist=rockyou.txt hashes.txt","https://github.com/openwall/john",{install:"apt install john",tags:["hash"],level:"Avancé",...E}),
  m("hashcat","Hashcat","cyber-cli","Audit de hash sur GPU","hashcat -m 1000 -a 0 hashes.txt wordlist.txt","https://github.com/hashcat/hashcat",{install:"apt install hashcat",tags:["hash","GPU"],level:"Avancé",...E,popular:true}),

  // ============== OSINT & RECON ==============
  m("theharvester","theHarvester","osint-recon","Collecte emails, domaines, hôtes publics","theHarvester -d example.com -b all","https://github.com/laramies/theHarvester",{install:"pipx install theHarvester",tags:["recon","email"],level:"Débutant",...E,popular:true}),
  m("amass","Amass","osint-recon","Cartographie d'attaque externe et sous-domaines","amass enum -d example.com","https://github.com/owasp-amass/amass",{install:"go install github.com/owasp-amass/amass/v4/...@master",tags:["recon","subdomain"],...E,featured:true}),
  m("subfinder","Subfinder","osint-recon","Énumération passive de sous-domaines","subfinder -d example.com","https://github.com/projectdiscovery/subfinder",{install:"go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest",tags:["subdomain"],level:"Débutant",...E,popular:true}),
  m("assetfinder","assetfinder","osint-recon","Recherche rapide de sous-domaines","assetfinder example.com","https://github.com/tomnomnom/assetfinder",{install:"go install github.com/tomnomnom/assetfinder@latest",tags:["subdomain"],level:"Débutant",...E}),
  m("findomain","Findomain","osint-recon","Découverte rapide de sous-domaines","findomain -t example.com","https://github.com/Findomain/Findomain",{tags:["subdomain"],level:"Débutant",...E}),
  m("dnsx","dnsx","osint-recon","Requêtes DNS rapides en masse","dnsx -l domains.txt -a -resp","https://github.com/projectdiscovery/dnsx",{install:"go install github.com/projectdiscovery/dnsx/cmd/dnsx@latest",tags:["dns"],...E}),
  m("shuffledns","shuffledns","osint-recon","Bruteforce DNS","shuffledns -d example.com -w words.txt -r resolvers.txt","https://github.com/projectdiscovery/shuffledns",{tags:["dns"],...E}),
  m("puredns","puredns","osint-recon","Résolution DNS massive","puredns bruteforce words.txt example.com","https://github.com/d3mondev/puredns",{tags:["dns"],...E}),
  m("dnsrecon","dnsrecon","osint-recon","Reconnaissance DNS","dnsrecon -d example.com","https://github.com/darkoperator/dnsrecon",{install:"apt install dnsrecon",tags:["dns"],...E}),
  m("dnsenum","dnsenum","osint-recon","Énumération DNS","dnsenum example.com","https://github.com/fwaeytens/dnsenum",{install:"apt install dnsenum",tags:["dns"],...E}),
  m("whois","whois","osint-recon","Informations publiques de domaine","whois example.com","https://github.com/rfc1036/whois",{install:"apt install whois",tags:["dns","domain"],level:"Débutant"}),
  m("dig","dig","osint-recon","Requêtes DNS interactives","dig example.com ANY +short","https://gitlab.isc.org/isc-projects/bind9",{install:"apt install dnsutils",tags:["dns"],level:"Débutant",popular:true}),
  m("host","host","osint-recon","Résolution DNS simple","host example.com","https://gitlab.isc.org/isc-projects/bind9",{install:"apt install bind9-host",tags:["dns"],level:"Débutant"}),
  m("nslookup","nslookup","osint-recon","Diagnostic DNS interactif","nslookup example.com","https://gitlab.isc.org/isc-projects/bind9",{tags:["dns"],level:"Débutant"}),
  m("sherlock","Sherlock","osint-recon","Recherche de pseudonymes publics","sherlock username","https://github.com/sherlock-project/sherlock",{install:"pipx install sherlock-project",tags:["username"],level:"Débutant",...E,popular:true}),
  m("maigret","Maigret","osint-recon","Recherche de comptes publics multi-sites","maigret username","https://github.com/soxoj/maigret",{install:"pipx install maigret",tags:["username"],level:"Débutant",...E}),
  m("holehe","holehe","osint-recon","Vérification d'usage public d'une adresse email","holehe user@example.com","https://github.com/megadose/holehe",{install:"pipx install holehe",tags:["email"],level:"Débutant",...E}),
  m("ghunt","GHunt","osint-recon","OSINT sur informations publiques Google","ghunt email user@gmail.com","https://github.com/mxrch/GHunt",{install:"pipx install ghunt",tags:["google","email"],...E}),
  m("socialscan","socialscan","osint-recon","Vérification d'emails et usernames","socialscan user@example.com","https://github.com/iojw/socialscan",{install:"pipx install socialscan",tags:["email","username"],...E}),
  m("photon","Photon","osint-recon","Crawler OSINT web","photon -u https://example.com","https://github.com/s0md3v/Photon",{install:"pipx install photon",tags:["crawler","osint"],...E}),
  m("spiderfoot","SpiderFoot CLI","osint-recon","Automatisation OSINT modulable","spiderfoot -s example.com -m sfp_dnsresolve","https://github.com/smicallef/spiderfoot",{tags:["framework","osint"],...E}),
  m("recon-ng","recon-ng","osint-recon","Framework OSINT en CLI","recon-ng","https://github.com/lanmaster53/recon-ng",{install:"pipx install recon-ng",tags:["framework","osint"],...E}),
  m("trufflehog","TruffleHog","osint-recon","Détection de secrets dans dépôts Git","trufflehog git https://github.com/org/repo","https://github.com/trufflesecurity/trufflehog",{install:"brew install trufflehog",tags:["secrets","git"],...E,popular:true}),
  m("gitleaks","Gitleaks","osint-recon","Détection de secrets Git","gitleaks detect --source .","https://github.com/gitleaks/gitleaks",{install:"brew install gitleaks",tags:["secrets","git"],...E}),
  m("git-secrets","git-secrets","osint-recon","Prévention de secrets dans Git","git secrets --scan","https://github.com/awslabs/git-secrets",{tags:["secrets","git"],...E}),
  m("gitrob","gitrob","osint-recon","Analyse de dépôts GitHub publics","gitrob analyze organization","https://github.com/michenriksen/gitrob",{tags:["github","osint"],...E}),
  m("github-subdomains","github-subdomains","osint-recon","Découverte de sous-domaines via GitHub","github-subdomains -d example.com -t TOKEN","https://github.com/gwen001/github-subdomains",{tags:["subdomain","github"],...E}),
  m("waymore","waymore","osint-recon","Collecte massive d'URLs archivées","waymore -i example.com","https://github.com/xnl-h4ck3r/waymore",{install:"pipx install waymore",tags:["wayback","recon"],...E}),

  // ============== NETWORK & DIAGNOSTICS ==============
  m("ping","ping","network-diag","Test de connectivité ICMP","ping -c 4 1.1.1.1","https://github.com/iputils/iputils",{tags:["icmp"],level:"Débutant",popular:true}),
  m("traceroute","traceroute","network-diag","Chemin réseau saut par saut","traceroute example.com","https://salsa.debian.org/md/traceroute",{install:"apt install traceroute",tags:["routing"],level:"Débutant"}),
  m("mtr","mtr","network-diag","Diagnostic réseau combiné ping + traceroute","mtr example.com","https://github.com/traviscross/mtr",{install:"apt install mtr",tags:["routing"],level:"Débutant",popular:true}),
  m("iperf3","iperf3","network-diag","Test de bande passante TCP/UDP","iperf3 -c iperf.example.com","https://github.com/esnet/iperf",{install:"apt install iperf3",tags:["bandwidth"]}),
  m("tcpdump","tcpdump","network-diag","Capture réseau en CLI","tcpdump -i eth0 -nn port 80","https://github.com/the-tcpdump-group/tcpdump",{install:"apt install tcpdump",os:LX,tags:["capture","pcap"],level:"Intermédiaire",popular:true}),
  m("tshark","tshark","network-diag","Version CLI de Wireshark","tshark -i eth0 -Y http","https://gitlab.com/wireshark/wireshark",{install:"apt install tshark",tags:["capture","pcap"]}),
  m("ngrep","ngrep","network-diag","grep réseau sur le trafic en direct","ngrep -d eth0 'GET' tcp port 80","https://github.com/jpr5/ngrep",{install:"apt install ngrep",os:LX,tags:["capture"]}),
  m("iftop","iftop","network-diag","Bande passante par connexion","iftop -i eth0","https://github.com/MarkusFix/iftop",{install:"apt install iftop",os:LX,tags:["monitoring"]}),
  m("nload","nload","network-diag","Monitoring réseau simple","nload","https://github.com/rolandriegel/nload",{install:"apt install nload",os:LX,tags:["monitoring"],level:"Débutant"}),
  m("bmon","bmon","network-diag","Visualisation de bande passante","bmon","https://github.com/tgraf/bmon",{install:"apt install bmon",os:LX,tags:["monitoring"]}),
  m("vnstat","vnstat","network-diag","Statistiques réseau journalières","vnstat -d","https://github.com/vergoh/vnstat",{install:"apt install vnstat",os:LX,tags:["stats"]}),
  m("ss","ss","network-diag","Sockets réseau Linux modernes","ss -tulpn","https://www.kernel.org/pub/linux/utils/net/iproute2/",{install:"apt install iproute2",os:LXONLY,tags:["sockets"],level:"Débutant"}),
  m("netstat","netstat","network-diag","Connexions réseau (legacy)","netstat -tulpn","https://sourceforge.net/projects/net-tools/",{install:"apt install net-tools",tags:["sockets"],level:"Débutant"}),
  m("iproute2","ip (iproute2)","network-diag","Configuration réseau Linux moderne","ip addr show","https://www.kernel.org/pub/linux/utils/net/iproute2/",{install:"apt install iproute2",os:LXONLY,tags:["config"],level:"Débutant"}),
  m("nmcli","nmcli","network-diag","Gestion NetworkManager en CLI","nmcli device status","https://gitlab.freedesktop.org/NetworkManager/NetworkManager",{install:"apt install network-manager",os:LXONLY,tags:["wifi","networkmanager"]}),
  m("ethtool","ethtool","network-diag","Diagnostic d'interface réseau","ethtool eth0","https://www.kernel.org/pub/software/network/ethtool/",{install:"apt install ethtool",os:LXONLY,tags:["nic"]}),
  m("arp-scan","arp-scan","network-diag","Découverte LAN par ARP","arp-scan --localnet","https://github.com/royhills/arp-scan",{install:"apt install arp-scan",os:LX,tags:["arp","lan"]}),
  m("arping","arping","network-diag","Test ARP","arping -c 3 192.168.1.1","https://github.com/ThomasHabets/arping",{install:"apt install arping",os:LX,tags:["arp"]}),
  m("fping","fping","network-diag","Ping multiple parallèle","fping -g 192.168.1.0/24","https://github.com/schweikert/fping",{install:"apt install fping",os:LX,tags:["icmp"]}),
  m("hping3","hping3","network-diag","Génération de paquets pour tests autorisés","hping3 -S -p 80 example.com","https://github.com/antirez/hping",{install:"apt install hping3",os:LX,tags:["packet"],level:"Avancé",...E}),
  m("tcptraceroute","tcptraceroute","network-diag","traceroute TCP","tcptraceroute example.com 443","https://github.com/mct/tcptraceroute",{install:"apt install tcptraceroute",os:LX,tags:["routing"]}),
  m("curl","curl","network-diag","Requêtes HTTP/API universelles","curl -i https://example.com","https://github.com/curl/curl",{install:"apt install curl",tags:["http","api"],level:"Débutant",popular:true}),
  m("wget","wget","network-diag","Téléchargement CLI robuste","wget https://example.com/file","https://savannah.gnu.org/git/?group=wget",{install:"apt install wget",tags:["http"],level:"Débutant",popular:true}),
  m("httpie","HTTPie","network-diag","Client HTTP lisible","http GET https://api.example.com/users","https://github.com/httpie/cli",{install:"pipx install httpie",tags:["http","api"],level:"Débutant"}),
  m("grpcurl","grpcurl","network-diag","Test d'API gRPC","grpcurl -plaintext localhost:50051 list","https://github.com/fullstorydev/grpcurl",{tags:["grpc","api"]}),
  m("websocat","websocat","network-diag","Client WebSocket CLI","websocat wss://echo.example.com","https://github.com/vi/websocat",{install:"cargo install websocat",tags:["websocket"]}),
  m("openssl","OpenSSL","network-diag","Tests cryptographiques et TLS","openssl s_client -connect example.com:443","https://github.com/openssl/openssl",{install:"apt install openssl",tags:["TLS","crypto"],popular:true}),

  // ============== FORENSIC & INCIDENT RESPONSE ==============
  m("volatility3","Volatility 3","forensic-ir","Analyse mémoire RAM","vol -f memory.raw windows.pslist","https://github.com/volatilityfoundation/volatility3",{install:"pipx install volatility3",tags:["memory","DFIR"],level:"Avancé",...E,featured:true}),
  m("bulk-extractor","bulk_extractor","forensic-ir","Extraction d'artefacts en masse","bulk_extractor -o out image.raw","https://github.com/simsong/bulk_extractor",{tags:["DFIR","carving"],level:"Avancé"}),
  m("binwalk","binwalk","forensic-ir","Analyse de firmware/fichiers binaires","binwalk -e firmware.bin","https://github.com/ReFirmLabs/binwalk",{install:"apt install binwalk",tags:["firmware","carving"],level:"Intermédiaire",popular:true}),
  m("foremost","foremost","forensic-ir","Récupération de fichiers par signature","foremost -i disk.img -o out","https://github.com/korczis/foremost",{install:"apt install foremost",os:LX,tags:["carving"]}),
  m("scalpel","scalpel","forensic-ir","File carving avancé","scalpel -o out disk.img","https://github.com/sleuthkit/scalpel",{install:"apt install scalpel",os:LX,tags:["carving"]}),
  m("sleuthkit","The Sleuth Kit","forensic-ir","Analyse forensic de disque","fls -r image.dd","https://github.com/sleuthkit/sleuthkit",{install:"apt install sleuthkit",tags:["disk","DFIR"],level:"Avancé"}),
  m("fls","fls","forensic-ir","Listing forensic de fichiers","fls -r image.dd","https://github.com/sleuthkit/sleuthkit",{install:"apt install sleuthkit",tags:["DFIR"]}),
  m("mmls","mmls","forensic-ir","Analyse de partitions","mmls image.dd","https://github.com/sleuthkit/sleuthkit",{install:"apt install sleuthkit",tags:["DFIR"]}),
  m("istat","istat","forensic-ir","Métadonnées inode","istat image.dd 1234","https://github.com/sleuthkit/sleuthkit",{install:"apt install sleuthkit",tags:["DFIR"]}),
  m("strings","strings","forensic-ir","Extraction de chaînes lisibles","strings binary | less","https://www.gnu.org/software/binutils/",{install:"apt install binutils",tags:["DFIR"],level:"Débutant",popular:true}),
  m("exiftool","ExifTool","forensic-ir","Métadonnées de fichiers","exiftool photo.jpg","https://github.com/exiftool/exiftool",{install:"apt install libimage-exiftool-perl",tags:["metadata"],level:"Débutant",popular:true}),
  m("xxd","xxd","forensic-ir","Affichage hexadécimal","xxd file | less","https://github.com/vim/vim",{install:"apt install xxd",tags:["hex"],level:"Débutant"}),
  m("hexdump","hexdump","forensic-ir","Analyse hexadécimale","hexdump -C file | less","https://github.com/util-linux/util-linux",{install:"apt install bsdmainutils",tags:["hex"],level:"Débutant"}),
  m("file","file","forensic-ir","Identification de fichiers par signature","file unknown.bin","https://github.com/file/file",{install:"apt install file",tags:["identification"],level:"Débutant"}),
  m("yara","YARA","forensic-ir","Règles de détection de malware","yara rules.yar sample.bin","https://github.com/VirusTotal/yara",{install:"apt install yara",tags:["signatures","detection"],...E,popular:true}),
  m("yarac","yarac","forensic-ir","Compilation de règles YARA","yarac rules.yar rules.compiled","https://github.com/VirusTotal/yara",{install:"apt install yara",tags:["signatures"]}),
  m("sigma-cli","sigma-cli","forensic-ir","Conversion de règles Sigma","sigma convert -t splunk rules/","https://github.com/SigmaHQ/sigma-cli",{install:"pipx install sigma-cli",tags:["detection","siem"],...E,recent:true}),
  m("chainsaw","Chainsaw","forensic-ir","Analyse rapide de logs Windows EVTX","chainsaw hunt -s sigma /var/log/evtx","https://github.com/WithSecureLabs/chainsaw",{tags:["windows","logs"],level:"Avancé",...E,recent:true}),
  m("evtx-dump","evtx_dump","forensic-ir","Lecture brute des journaux EVTX","evtx_dump Security.evtx","https://github.com/omerbenamram/evtx",{install:"cargo install evtx",tags:["windows","logs"]}),
  m("plaso","Plaso (log2timeline)","forensic-ir","Génération de timeline forensic","log2timeline.py timeline.plaso disk.img","https://github.com/log2timeline/plaso",{install:"pipx install plaso",tags:["timeline","DFIR"],level:"Avancé"}),
  m("timesketch","Timesketch CLI","forensic-ir","Analyse chronologique d'incidents","timesketch_importer -u admin timeline.plaso","https://github.com/google/timesketch",{tags:["timeline"]}),
  m("velociraptor","Velociraptor","forensic-ir","Collecte et réponse à incident","velociraptor query 'SELECT * FROM info()'","https://github.com/Velocidex/velociraptor",{tags:["EDR","DFIR"],level:"Avancé"}),
  m("rkhunter","rkhunter","blueteam","Détection de rootkits Linux","rkhunter --check","https://sourceforge.net/projects/rkhunter/",{install:"apt install rkhunter",os:LXONLY,tags:["rootkit"]}),
  m("chkrootkit","chkrootkit","blueteam","Détection de rootkits","chkrootkit","http://www.chkrootkit.org/",{install:"apt install chkrootkit",os:LXONLY,tags:["rootkit"]}),
  m("lynis","Lynis","blueteam","Audit de sécurité Linux/Unix","lynis audit system","https://github.com/CISOfy/lynis",{install:"apt install lynis",os:LX,tags:["audit","hardening"],popular:true}),
  m("aide","AIDE","blueteam","Contrôle d'intégrité de fichiers","aide --check","https://github.com/aide/aide",{install:"apt install aide",os:LXONLY,tags:["integrity"]}),
  m("auditctl","auditctl / ausearch","blueteam","Audit Linux noyau","ausearch -k user_action","https://github.com/linux-audit/audit-userspace",{install:"apt install auditd",os:LXONLY,tags:["audit"]}),
  m("journalctl-forensic","journalctl","forensic-ir","Analyse de logs systemd","journalctl -p err -b","https://github.com/systemd/systemd",{os:LXONLY,tags:["logs"],level:"Débutant"}),

  // ============== MALWARE ANALYSIS & RE ==============
  m("capa","capa","malware-re","Détection de capacités de malware","capa sample.exe","https://github.com/mandiant/capa",{install:"pipx install flare-capa",tags:["malware","detection"],...E,recent:true}),
  m("floss","FLOSS","malware-re","Extraction de chaînes obfusquées","floss sample.exe","https://github.com/mandiant/flare-floss",{install:"pipx install flare-floss",tags:["malware","strings"],...E}),
  m("radare2","Radare2","malware-re","Reverse engineering CLI","r2 -A sample.exe","https://github.com/radareorg/radare2",{install:"apt install radare2",tags:["reverse","disasm"],level:"Avancé",...E,popular:true,featured:true}),
  m("rizin","Rizin","malware-re","Framework reverse engineering CLI","rizin -A sample.exe","https://github.com/rizinorg/rizin",{tags:["reverse","disasm"],level:"Avancé",...E}),
  m("ghidra-headless","Ghidra Headless","malware-re","Analyse Ghidra en mode batch","analyzeHeadless /tmp proj -import sample.exe","https://github.com/NationalSecurityAgency/ghidra",{tags:["reverse"],level:"Avancé",...E}),
  m("objdump","objdump","malware-re","Analyse binaire ELF/PE","objdump -d sample.bin | less","https://www.gnu.org/software/binutils/",{install:"apt install binutils",tags:["binary"]}),
  m("readelf","readelf","malware-re","Analyse fine de fichiers ELF","readelf -a sample.elf","https://www.gnu.org/software/binutils/",{install:"apt install binutils",os:LX,tags:["elf"]}),
  m("ltrace","ltrace","malware-re","Tracing des appels de librairies","ltrace ./sample","https://gitlab.com/cespedes/ltrace",{install:"apt install ltrace",os:LXONLY,tags:["trace"]}),
  m("strace","strace","malware-re","Tracing des appels système","strace -f ./sample","https://github.com/strace/strace",{install:"apt install strace",os:LXONLY,tags:["trace"],level:"Intermédiaire"}),
  m("upx","UPX","malware-re","Packing/unpacking d'exécutables","upx -d packed.exe","https://github.com/upx/upx",{install:"apt install upx",tags:["packer"]}),
  m("pefile","pefile","malware-re","Analyse de fichiers PE Windows","python -m pefile sample.exe","https://github.com/erocarrera/pefile",{install:"pipx install pefile",tags:["pe","windows"],...E}),
  m("clamav","ClamAV / clamscan","malware-re","Scan antivirus open source","clamscan -r /home","https://github.com/Cisco-Talos/clamav",{install:"apt install clamav",tags:["av"],popular:true}),
  m("ssdeep","ssdeep","malware-re","Fuzzy hashing","ssdeep sample.bin","https://github.com/ssdeep-project/ssdeep",{install:"apt install ssdeep",tags:["hash","fuzzy"]}),
  m("tlsh","TLSH","malware-re","Fuzzy hashing pour clustering","tlsh -f sample.bin","https://github.com/trendmicro/tlsh",{tags:["hash","fuzzy"]}),
  m("vt-cli","vt-cli","malware-re","Interrogation VirusTotal en CLI","vt file sample.exe","https://github.com/VirusTotal/vt-cli",{tags:["virustotal"],...E,recent:true}),

  // ============== SYSTEM ADMINISTRATION ==============
  m("bash","Bash","sysadmin","Shell par défaut Linux et scripting","bash script.sh","https://savannah.gnu.org/git/?group=bash",{install:"apt install bash",tags:["shell"],level:"Débutant",popular:true}),
  m("zsh","Zsh","sysadmin","Shell avancé avec auto-complétion","zsh","https://github.com/zsh-users/zsh",{install:"apt install zsh",tags:["shell"],level:"Débutant"}),
  m("fish","Fish","sysadmin","Shell interactif moderne","fish","https://github.com/fish-shell/fish-shell",{install:"apt install fish",tags:["shell"],level:"Débutant"}),
  m("powershell","PowerShell","sysadmin","Shell objet multiplateforme","pwsh -Command 'Get-Process | Select -First 5'","https://github.com/PowerShell/PowerShell",{tags:["shell","windows"],popular:true}),
  m("systemctl","systemctl","sysadmin","Gestion des services Linux","systemctl status sshd","https://github.com/systemd/systemd",{os:LXONLY,tags:["systemd"],level:"Débutant",popular:true}),
  m("journalctl","journalctl","sysadmin","Consultation des logs systemd","journalctl -u sshd -f","https://github.com/systemd/systemd",{os:LXONLY,tags:["logs","systemd"],level:"Débutant"}),
  m("crontab","crontab","sysadmin","Planification de tâches","crontab -e","https://github.com/cronie-crond/cronie",{os:LX,tags:["cron"],level:"Débutant"}),
  m("rsync","rsync","sysadmin","Synchronisation de fichiers efficace","rsync -avz src/ user@host:dst/","https://github.com/WayneD/rsync",{install:"apt install rsync",tags:["sync","backup"],level:"Débutant",popular:true}),
  m("rclone","rclone","sysadmin","Synchronisation cloud multi-providers","rclone sync local/ remote:bucket","https://github.com/rclone/rclone",{install:"apt install rclone",tags:["cloud","sync"],popular:true}),
  m("scp","scp","sysadmin","Copie SSH","scp file.txt user@host:/tmp/","https://github.com/openssh/openssh-portable",{tags:["ssh"],level:"Débutant"}),
  m("sftp","sftp","sysadmin","Transfert sécurisé interactif","sftp user@host","https://github.com/openssh/openssh-portable",{tags:["ssh"],level:"Débutant"}),
  m("ssh","ssh","sysadmin","Accès distant sécurisé","ssh user@host","https://github.com/openssh/openssh-portable",{install:"apt install openssh-client",tags:["ssh"],level:"Débutant",popular:true,featured:true}),
  m("tmux","tmux","sysadmin","Multiplexeur de terminal","tmux new -s work","https://github.com/tmux/tmux",{install:"apt install tmux",tags:["terminal"],level:"Débutant",popular:true}),
  m("screen","GNU Screen","sysadmin","Sessions terminal persistantes","screen -S work","https://savannah.gnu.org/git/?group=screen",{install:"apt install screen",tags:["terminal"]}),
  m("htop","htop","sysadmin","Supervision interactive des processus","htop","https://github.com/htop-dev/htop",{install:"apt install htop",os:LX,tags:["monitoring"],level:"Débutant",popular:true}),
  m("btop","btop","sysadmin","Supervision système moderne","btop","https://github.com/aristocratos/btop",{install:"apt install btop",tags:["monitoring"],level:"Débutant",recent:true}),
  m("glances","Glances","sysadmin","Monitoring système complet","glances","https://github.com/nicolargo/glances",{install:"pipx install glances",tags:["monitoring"]}),
  m("iotop","iotop","sysadmin","Monitoring des I/O disque","iotop","https://github.com/Tomas-M/iotop",{install:"apt install iotop",os:LXONLY,tags:["io"]}),
  m("dstat","dstat","sysadmin","Statistiques système combinées","dstat -cdngy","https://github.com/dstat-real/dstat",{install:"apt install dstat",os:LXONLY,tags:["stats"]}),
  m("vmstat","vmstat","sysadmin","Statistiques mémoire/processus","vmstat 2 5","https://github.com/util-linux/util-linux",{os:LXONLY,tags:["stats"],level:"Débutant"}),
  m("iostat","iostat","sysadmin","Statistiques disques","iostat -x 2","https://github.com/sysstat/sysstat",{install:"apt install sysstat",os:LXONLY,tags:["disk"]}),
  m("free","free","sysadmin","Utilisation mémoire","free -h","https://gitlab.com/procps-ng/procps",{os:LXONLY,tags:["memory"],level:"Débutant"}),
  m("df","df","sysadmin","Espace disque","df -h","https://www.gnu.org/software/coreutils/",{tags:["disk"],level:"Débutant"}),
  m("du","du","sysadmin","Taille des dossiers","du -sh *","https://www.gnu.org/software/coreutils/",{tags:["disk"],level:"Débutant"}),
  m("lsof","lsof","sysadmin","Fichiers et sockets ouverts","lsof -i :443","https://github.com/lsof-org/lsof",{install:"apt install lsof",os:LX,tags:["files"],level:"Débutant"}),
  m("ps","ps","sysadmin","Liste des processus","ps aux","https://gitlab.com/procps-ng/procps",{tags:["processes"],level:"Débutant"}),
  m("pkill","kill / pkill","sysadmin","Gestion des processus","pkill -f myapp","https://gitlab.com/procps-ng/procps",{os:LX,tags:["processes"],level:"Débutant"}),
  m("useradd","useradd / usermod","sysadmin","Gestion des utilisateurs Linux","useradd -m alice","https://github.com/shadow-maint/shadow",{os:LXONLY,tags:["users"],level:"Débutant"}),
  m("groupadd","groupadd","sysadmin","Gestion des groupes","groupadd team","https://github.com/shadow-maint/shadow",{os:LXONLY,tags:["users"],level:"Débutant"}),
  m("chmod","chmod","sysadmin","Permissions fichiers","chmod 640 file","https://www.gnu.org/software/coreutils/",{tags:["files"],level:"Débutant"}),
  m("chown","chown","sysadmin","Propriété fichiers","chown user:group file","https://www.gnu.org/software/coreutils/",{tags:["files"],level:"Débutant"}),
  m("tar","tar","sysadmin","Archivage","tar -czf out.tgz dir/","https://savannah.gnu.org/git/?group=tar",{tags:["archive"],level:"Débutant"}),
  m("gzip","gzip / xz / zstd","sysadmin","Compression de fichiers","zstd file -o file.zst","https://github.com/facebook/zstd",{tags:["compression"],level:"Débutant"}),
  m("borgbackup","BorgBackup","sysadmin","Sauvegarde dédupliquée et chiffrée","borg create repo::backup ~/data","https://github.com/borgbackup/borg",{install:"apt install borgbackup",tags:["backup"]}),
  m("restic","restic","sysadmin","Sauvegarde chiffrée moderne","restic backup ~/data","https://github.com/restic/restic",{install:"apt install restic",tags:["backup"],popular:true}),
  m("duplicity","Duplicity","sysadmin","Sauvegarde incrémentale chiffrée","duplicity ~/data sftp://user@host","https://gitlab.com/duplicity/duplicity",{install:"apt install duplicity",tags:["backup"]}),
  m("apt","apt / dnf / yum / pacman","sysadmin","Gestion de paquets Linux","apt update && apt install pkg","https://salsa.debian.org/apt-team/apt",{os:LXONLY,tags:["packages"],level:"Débutant",popular:true}),
  m("winget","winget","sysadmin","Gestion de paquets Windows","winget install Git.Git","https://github.com/microsoft/winget-cli",{os:["Windows"],tags:["packages","windows"]}),
  m("choco","Chocolatey","sysadmin","Gestion de paquets Windows","choco install git -y","https://github.com/chocolatey/choco",{os:["Windows"],tags:["packages","windows"]}),
  m("scoop","Scoop","sysadmin","Gestion de paquets Windows portable","scoop install git","https://github.com/ScoopInstaller/Scoop",{os:["Windows"],tags:["packages","windows"]}),
  m("fail2ban","fail2ban-client","blueteam","Gestion de Fail2ban","fail2ban-client status sshd","https://github.com/fail2ban/fail2ban",{install:"apt install fail2ban",os:LXONLY,tags:["IPS","hardening"]}),
  m("iptables","iptables","sysadmin","Pare-feu Linux historique","iptables -L -n","https://www.netfilter.org/",{os:LXONLY,tags:["firewall"]}),
  m("nftables","nftables (nft)","sysadmin","Pare-feu Linux moderne","nft list ruleset","https://www.netfilter.org/projects/nftables/",{install:"apt install nftables",os:LXONLY,tags:["firewall"]}),
  m("ufw","UFW","sysadmin","Pare-feu Linux simplifié","ufw allow 22/tcp","https://launchpad.net/ufw",{install:"apt install ufw",os:LXONLY,tags:["firewall"],level:"Débutant"}),

  // ============== DEVOPS & CLOUD ==============
  m("docker","Docker","devops-cloud","Gestion de conteneurs","docker run -d -p 80:80 nginx","https://github.com/docker/cli",{tags:["containers"],level:"Débutant",popular:true,featured:true}),
  m("docker-compose","docker compose","devops-cloud","Orchestration multi-conteneurs locale","docker compose up -d","https://github.com/docker/compose",{tags:["containers"],level:"Débutant",popular:true}),
  m("podman","Podman","devops-cloud","Alternative Docker sans daemon","podman run -d -p 80:80 nginx","https://github.com/containers/podman",{install:"apt install podman",os:LX,tags:["containers"]}),
  m("buildah","Buildah","devops-cloud","Construction d'images OCI","buildah bud -t myimg .","https://github.com/containers/buildah",{install:"apt install buildah",os:LXONLY,tags:["containers"]}),
  m("skopeo","Skopeo","devops-cloud","Manipulation d'images conteneur","skopeo copy docker://nginx oci:./nginx","https://github.com/containers/skopeo",{install:"apt install skopeo",os:LX,tags:["containers"]}),
  m("kubectl","kubectl","devops-cloud","Gestion Kubernetes","kubectl get pods -A","https://github.com/kubernetes/kubectl",{tags:["k8s"],level:"Intermédiaire",popular:true,featured:true}),
  m("helm","Helm","devops-cloud","Gestion de charts Kubernetes","helm install app ./chart","https://github.com/helm/helm",{tags:["k8s"],popular:true}),
  m("k9s","k9s","devops-cloud","Interface terminal Kubernetes","k9s","https://github.com/derailed/k9s",{tags:["k8s","tui"],recent:true}),
  m("kind","kind","devops-cloud","Clusters Kubernetes locaux","kind create cluster","https://github.com/kubernetes-sigs/kind",{tags:["k8s","dev"]}),
  m("minikube","minikube","devops-cloud","Kubernetes local pour dev","minikube start","https://github.com/kubernetes/minikube",{tags:["k8s","dev"]}),
  m("terraform","Terraform","devops-cloud","Infrastructure as Code","terraform init && terraform apply","https://github.com/hashicorp/terraform",{tags:["iac"],popular:true,featured:true}),
  m("opentofu","OpenTofu","devops-cloud","Alternative open source à Terraform","tofu init && tofu apply","https://github.com/opentofu/opentofu",{tags:["iac"],recent:true}),
  m("ansible","Ansible","devops-cloud","Automatisation de configuration","ansible all -m ping","https://github.com/ansible/ansible",{install:"pipx install ansible",tags:["config"],popular:true}),
  m("ansible-playbook","ansible-playbook","devops-cloud","Exécution de playbooks Ansible","ansible-playbook site.yml","https://github.com/ansible/ansible",{tags:["config"]}),
  m("ansible-vault","ansible-vault","devops-cloud","Chiffrement de secrets Ansible","ansible-vault encrypt secrets.yml","https://github.com/ansible/ansible",{tags:["secrets"]}),
  m("packer","Packer","devops-cloud","Création d'images système","packer build template.pkr.hcl","https://github.com/hashicorp/packer",{tags:["iac"]}),
  m("vagrant","Vagrant","devops-cloud","Environnements VM reproductibles","vagrant up","https://github.com/hashicorp/vagrant",{tags:["vm","dev"]}),
  m("vault","Vault","devops-cloud","Gestion de secrets HashiCorp","vault kv get secret/app","https://github.com/hashicorp/vault",{tags:["secrets"]}),
  m("consul","Consul","devops-cloud","Service discovery et config","consul members","https://github.com/hashicorp/consul",{tags:["discovery"]}),
  m("awscli","AWS CLI","devops-cloud","Gestion AWS","aws s3 ls","https://github.com/aws/aws-cli",{install:"pipx install awscli",tags:["aws","cloud"],popular:true}),
  m("azurecli","Azure CLI","devops-cloud","Gestion Azure","az login","https://github.com/Azure/azure-cli",{tags:["azure","cloud"]}),
  m("gcloud","gcloud","devops-cloud","Gestion Google Cloud","gcloud auth login","https://cloud.google.com/sdk",{tags:["gcp","cloud"]}),
  m("doctl","doctl","devops-cloud","DigitalOcean CLI","doctl compute droplet list","https://github.com/digitalocean/doctl",{tags:["digitalocean","cloud"]}),
  m("flyctl","flyctl","devops-cloud","Fly.io CLI","flyctl deploy","https://github.com/superfly/flyctl",{tags:["paas","cloud"]}),
  m("vercel","Vercel CLI","devops-cloud","Déploiement Vercel","vercel --prod","https://github.com/vercel/vercel",{install:"npm i -g vercel",tags:["paas"]}),
  m("netlify","Netlify CLI","devops-cloud","Déploiement Netlify","netlify deploy --prod","https://github.com/netlify/cli",{install:"npm i -g netlify-cli",tags:["paas"]}),
  m("gh","GitHub CLI","devops-cloud","CLI officielle GitHub","gh pr create","https://github.com/cli/cli",{install:"apt install gh",tags:["github","git"],popular:true}),
  m("git","git","devops-cloud","Gestion de version","git status","https://github.com/git/git",{install:"apt install git",tags:["git"],level:"Débutant",popular:true,featured:true}),
  m("lazygit","lazygit","devops-cloud","Interface terminal Git","lazygit","https://github.com/jesseduffield/lazygit",{tags:["git","tui"],recent:true}),
  m("pre-commit","pre-commit","devops-cloud","Hooks Git automatisés","pre-commit install","https://github.com/pre-commit/pre-commit",{install:"pipx install pre-commit",tags:["git"]}),
  m("act","act","devops-cloud","Exécution locale des GitHub Actions","act -j build","https://github.com/nektos/act",{tags:["ci","github"]}),
  m("make","make","devops-cloud","Automatisation de build","make build","https://www.gnu.org/software/make/",{install:"apt install make",tags:["build"],level:"Débutant"}),
  m("just","just","devops-cloud","Alternative moderne à make","just build","https://github.com/casey/just",{install:"cargo install just",tags:["build"]}),
  m("task","task","devops-cloud","Task runner CLI","task default","https://github.com/go-task/task",{tags:["build"]}),
  m("direnv","direnv","devops-cloud","Variables d'environnement par dossier","direnv allow","https://github.com/direnv/direnv",{install:"apt install direnv",tags:["env"]}),

  // ============== DEVELOPER PRODUCTIVITY ==============
  m("ripgrep","ripgrep (rg)","devprod","Recherche de code ultra-rapide","rg pattern src/","https://github.com/BurntSushi/ripgrep",{install:"apt install ripgrep",tags:["search"],level:"Débutant",popular:true,featured:true}),
  m("fd","fd","devprod","Alternative moderne à find","fd 'README'","https://github.com/sharkdp/fd",{install:"apt install fd-find",tags:["search"],level:"Débutant"}),
  m("fzf","fzf","devprod","Recherche fuzzy interactive","fzf","https://github.com/junegunn/fzf",{install:"apt install fzf",tags:["search","tui"],popular:true}),
  m("bat","bat","devprod","cat avec coloration syntaxique","bat file.txt","https://github.com/sharkdp/bat",{install:"apt install bat",tags:["cli"],level:"Débutant"}),
  m("eza","eza","devprod","ls moderne en Rust","eza -la --git","https://github.com/eza-community/eza",{install:"cargo install eza",tags:["cli"],level:"Débutant"}),
  m("tree","tree","devprod","Affichage arborescent","tree -L 2","https://github.com/Old-Man-Programmer/tree",{install:"apt install tree",tags:["cli"],level:"Débutant"}),
  m("jq","jq","devprod","Traitement JSON en CLI","echo '{}' | jq .","https://github.com/jqlang/jq",{install:"apt install jq",tags:["json"],level:"Débutant",popular:true,featured:true}),
  m("yq","yq","devprod","Traitement YAML/JSON","yq '.key' file.yaml","https://github.com/mikefarah/yq",{tags:["yaml"],level:"Débutant",popular:true}),
  m("sed","sed","devprod","Traitement de texte par flux","sed 's/old/new/g' file","https://www.gnu.org/software/sed/",{tags:["text"],level:"Intermédiaire"}),
  m("awk","awk","devprod","Traitement de texte structuré","awk '{print $1}' file","https://www.gnu.org/software/gawk/",{tags:["text"]}),
  m("grep","grep","devprod","Recherche de texte universelle","grep -rn 'TODO' src/","https://www.gnu.org/software/grep/",{tags:["search"],level:"Débutant",popular:true}),
  m("cut","cut","devprod","Extraction de colonnes","cut -d, -f1 file.csv","https://www.gnu.org/software/coreutils/",{tags:["text"],level:"Débutant"}),
  m("sort","sort","devprod","Tri de lignes","sort -u file","https://www.gnu.org/software/coreutils/",{tags:["text"],level:"Débutant"}),
  m("uniq","uniq","devprod","Suppression de doublons","sort file | uniq","https://www.gnu.org/software/coreutils/",{tags:["text"],level:"Débutant"}),
  m("xargs","xargs","devprod","Pipeline avancé","ls | xargs -I{} echo {}","https://www.gnu.org/software/findutils/",{tags:["pipeline"]}),
  m("parallel","GNU parallel","devprod","Exécution parallèle de commandes","parallel echo ::: a b c","https://www.gnu.org/software/parallel/",{install:"apt install parallel",tags:["pipeline"]}),
  m("tldr","tldr","devprod","Documentation rapide et exemples","tldr tar","https://github.com/tldr-pages/tldr",{install:"npm i -g tldr",tags:["docs"],level:"Débutant",popular:true}),
  m("man","man","devprod","Documentation système","man bash","https://www.kernel.org/pub/linux/docs/man-pages/",{tags:["docs"],level:"Débutant"}),
  m("cheatsh","cheat.sh","devprod","Aide-mémoire de commandes","curl cheat.sh/tar","https://github.com/chubin/cheat.sh",{tags:["docs"],level:"Débutant"}),
  m("asciinema","asciinema","devprod","Enregistrement de sessions terminal","asciinema rec demo.cast","https://github.com/asciinema/asciinema",{install:"pipx install asciinema",tags:["recording"]}),
  m("hyperfine","hyperfine","devprod","Benchmark de commandes","hyperfine 'cmd1' 'cmd2'","https://github.com/sharkdp/hyperfine",{install:"cargo install hyperfine",tags:["benchmark"]}),
  m("tokei","tokei","devprod","Statistiques de code","tokei src/","https://github.com/XAMPPRocky/tokei",{install:"cargo install tokei",tags:["stats"]}),
  m("cloc","cloc","devprod","Comptage de lignes de code","cloc src/","https://github.com/AlDanial/cloc",{install:"apt install cloc",tags:["stats"]}),
  m("shellcheck","ShellCheck","devprod","Analyse statique de scripts shell","shellcheck script.sh","https://github.com/koalaman/shellcheck",{install:"apt install shellcheck",tags:["lint","shell"],popular:true}),
  m("shfmt","shfmt","devprod","Formatage de scripts shell","shfmt -w script.sh","https://github.com/mvdan/sh",{tags:["format","shell"]}),
  m("black","Black","devprod","Formatage Python opinionnant","black .","https://github.com/psf/black",{install:"pipx install black",tags:["python","format"],popular:true}),
  m("ruff","Ruff","devprod","Linter Python ultra-rapide","ruff check .","https://github.com/astral-sh/ruff",{install:"pipx install ruff",tags:["python","lint"],recent:true,popular:true}),
  m("mypy","mypy","devprod","Vérification de types Python","mypy src/","https://github.com/python/mypy",{install:"pipx install mypy",tags:["python","types"]}),
  m("pylint","Pylint","devprod","Analyse statique Python","pylint src/","https://github.com/pylint-dev/pylint",{install:"pipx install pylint",tags:["python","lint"]}),
  m("bandit","Bandit","devprod","Analyse de sécurité Python","bandit -r src/","https://github.com/PyCQA/bandit",{install:"pipx install bandit",tags:["python","security"]}),
  m("semgrep","Semgrep","devprod","Analyse statique de sécurité","semgrep --config auto .","https://github.com/semgrep/semgrep",{install:"pipx install semgrep",tags:["sast","security"],popular:true}),
  m("snyk","Snyk CLI","devprod","Audit de dépendances","snyk test","https://github.com/snyk/cli",{install:"npm i -g snyk",tags:["security","deps"]}),
  m("trivy","Trivy","devprod","Scan conteneurs / dépendances / IaC","trivy image nginx:latest","https://github.com/aquasecurity/trivy",{tags:["security","containers"],popular:true,recent:true}),
  m("grype","Grype","devprod","Scan de vulnérabilités","grype dir:.","https://github.com/anchore/grype",{tags:["security"]}),
  m("syft","Syft","devprod","Génération de SBOM","syft dir:.","https://github.com/anchore/syft",{tags:["sbom"]}),
  m("osv-scanner","osv-scanner","devprod","Scan de vulnérabilités open source","osv-scanner -r .","https://github.com/google/osv-scanner",{tags:["security","deps"],recent:true}),
  m("checkov","Checkov","devprod","Audit Infrastructure as Code","checkov -d .","https://github.com/bridgecrewio/checkov",{install:"pipx install checkov",tags:["iac","security"]}),
  m("terrascan","terrascan","devprod","Sécurité IaC","terrascan scan","https://github.com/tenable/terrascan",{tags:["iac","security"]}),
  m("kube-bench","kube-bench","blueteam","Benchmark sécurité Kubernetes (CIS)","kube-bench run","https://github.com/aquasecurity/kube-bench",{tags:["k8s","security"]}),
  m("kube-hunter","kube-hunter","blueteam","Audit Kubernetes autorisé","kube-hunter --remote cluster","https://github.com/aquasecurity/kube-hunter",{install:"pipx install kube-hunter",tags:["k8s","security"],...E}),

  // ============== DATABASES & DATA ==============
  m("mysql","mysql","databases-data","Client MySQL / MariaDB","mysql -u root -p","https://github.com/mysql/mysql-server",{install:"apt install mysql-client",tags:["sql"],level:"Débutant",popular:true}),
  m("psql","psql","databases-data","Client PostgreSQL","psql -h host -U user db","https://github.com/postgres/postgres",{install:"apt install postgresql-client",tags:["sql"],level:"Débutant",popular:true}),
  m("sqlite3","sqlite3","databases-data","Client SQLite","sqlite3 db.sqlite","https://sqlite.org/",{install:"apt install sqlite3",tags:["sql"],level:"Débutant",popular:true}),
  m("mongosh","mongosh","databases-data","Client MongoDB","mongosh","https://github.com/mongodb-js/mongosh",{tags:["nosql"]}),
  m("redis-cli","redis-cli","databases-data","Client Redis","redis-cli","https://github.com/redis/redis",{install:"apt install redis-tools",tags:["cache","nosql"],popular:true}),
  m("pg_dump","pg_dump","databases-data","Sauvegarde PostgreSQL","pg_dump db > dump.sql","https://github.com/postgres/postgres",{tags:["backup","sql"]}),
  m("mysqldump","mysqldump","databases-data","Sauvegarde MySQL/MariaDB","mysqldump -u root db > dump.sql","https://github.com/mysql/mysql-server",{tags:["backup","sql"]}),
  m("pg_restore","pg_restore","databases-data","Restauration PostgreSQL","pg_restore -d db dump.sql","https://github.com/postgres/postgres",{tags:["backup","sql"]}),
  m("csvkit","csvkit","databases-data","Manipulation CSV en CLI","csvlook data.csv","https://github.com/wireservice/csvkit",{install:"pipx install csvkit",tags:["csv","data"]}),
  m("miller","Miller (mlr)","databases-data","Traitement CSV/JSON polyvalent","mlr --csv cat data.csv","https://github.com/johnkerl/miller",{install:"apt install miller",tags:["csv","json"]}),
  m("xsv","xsv","databases-data","Analyse CSV ultra-rapide","xsv stats data.csv","https://github.com/BurntSushi/xsv",{install:"cargo install xsv",tags:["csv","rust"]}),
  m("duckdb","DuckDB","databases-data","Analyse SQL locale très rapide","duckdb -c 'SELECT 1'","https://github.com/duckdb/duckdb",{tags:["sql","analytics"],popular:true,recent:true,featured:true}),
  m("sqlite-utils","sqlite-utils","databases-data","Manipulation SQLite scriptable","sqlite-utils insert db.sqlite tbl data.json","https://github.com/simonw/sqlite-utils",{install:"pipx install sqlite-utils",tags:["sql"]}),
  m("datasette","Datasette CLI","databases-data","Publication de données SQLite","datasette serve db.sqlite","https://github.com/simonw/datasette",{install:"pipx install datasette",tags:["sql","web"]}),

  // ============== BLUE TEAM & MONITORING ==============
  m("suricata","Suricata","blueteam","IDS/IPS réseau","suricata -c suricata.yaml -i eth0","https://github.com/OISF/suricata",{install:"apt install suricata",os:LX,tags:["ids","network"]}),
  m("snort","Snort","blueteam","IDS réseau historique","snort -c snort.conf -i eth0","https://github.com/snort3/snort3",{tags:["ids","network"]}),
  m("zeek","Zeek","blueteam","Analyse de trafic réseau","zeek -i eth0","https://github.com/zeek/zeek",{tags:["nta","monitoring"]}),
  m("wazuh-agent","wazuh-agent-control","blueteam","Gestion d'agents Wazuh","wazuh-agent-control -l","https://github.com/wazuh/wazuh",{tags:["xdr","siem"]}),
  m("osquery","osqueryi","blueteam","Requêtes système en SQL","osqueryi 'SELECT * FROM users;'","https://github.com/osquery/osquery",{tags:["edr","sql"],popular:true}),
];

// Filtres rapides (catégories tagguées sur les tools via OS/tags/level)
export const getCategory = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)!;

export const toolsByCategory = (slug: CategorySlug) =>
  tools.filter((t) => t.category === slug);

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
