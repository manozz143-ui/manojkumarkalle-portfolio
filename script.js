/* ============================================================
   Animated shell-scripting / code "rain" background
   ============================================================ */
(function codeBackground() {
  const canvas = document.getElementById("code-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Snippets of real shell / devops code that scroll down the screen
  const snippets = [
    "#!/bin/bash", "set -euo pipefail", "kubectl get pods -A",
    "docker build -t app:latest .", "terraform apply -auto-approve",
    "ansible-playbook site.yml", "aws s3 sync ./ s3://bucket",
    "az aks get-credentials", "systemctl restart nginx",
    "git push origin main", "helm upgrade --install app .",
    "for i in $(seq 1 10); do", "echo \"deploying...\"",
    "grep -r 'ERROR' /var/log", "chmod +x deploy.sh",
    "kubectl rollout status", "docker-compose up -d",
    "curl -sf http://localhost:8080/health", "tail -f app.log",
    "crontab -e", "ssh user@prod-server", "export KUBECONFIG=~/.kube/config",
    "df -h && free -m", "iptables -L -n", "journalctl -u docker",
    "ansible all -m ping", "aws ec2 describe-instances", "kubectl logs -f pod",
    "sudo yum update -y", "trap 'cleanup' EXIT", "if [ $? -eq 0 ]; then",
    "vault kv get secret/app", "prometheus --config.file",
  ];

  const colGreen = "#39d353";
  const colBlue = "#58a6ff";
  const colMuted = "#3a4a5c";

  let columns = [];
  let fontSize = 15;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = window.innerWidth < 640 ? 12 : 15;
    const colWidth = 190;
    const count = Math.max(6, Math.floor(canvas.width / colWidth));
    columns = [];
    for (let i = 0; i < count; i++) {
      columns.push({
        x: (i + 0.5) * (canvas.width / count) - 70,
        y: Math.random() * canvas.height,
        speed: 0.4 + Math.random() * 0.9,
        text: snippets[Math.floor(Math.random() * snippets.length)],
        color: Math.random() > 0.7 ? colBlue : (Math.random() > 0.5 ? colGreen : colMuted),
      });
    }
  }

  function draw() {
    ctx.fillStyle = "rgba(10, 14, 20, 0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (const col of columns) {
      ctx.fillStyle = col.color;
      ctx.fillText(col.text, col.x, col.y);
      col.y += col.speed;
      if (col.y > canvas.height + 20) {
        col.y = -20;
        col.x = Math.random() * canvas.width;
        col.text = snippets[Math.floor(Math.random() * snippets.length)];
        col.speed = 0.4 + Math.random() * 0.9;
        col.color = Math.random() > 0.7 ? colBlue : (Math.random() > 0.5 ? colGreen : colMuted);
      }
    }
    requestAnimationFrame(draw);
  }

  setup();
  draw();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 200);
  });
})();

/* ============================================================
   Hero terminal typing effect (loops through commands)
   ============================================================ */
(function typedCommand() {
  const el = document.getElementById("typed-cmd");
  if (!el) return;
  const commands = [
    "kubectl apply -f deployment.yaml",
    "docker run -d --name web nginx:alpine",
    "ansible-playbook -i hosts provision.yml",
    "terraform plan && terraform apply",
    "aws eks update-kubeconfig --name prod",
    "./deploy.sh --env production",
  ];
  let ci = 0, chi = 0, deleting = false;

  function tick() {
    const cmd = commands[ci];
    if (!deleting) {
      el.textContent = cmd.slice(0, ++chi);
      if (chi === cmd.length) {
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      el.textContent = cmd.slice(0, --chi);
      if (chi === 0) {
        deleting = false;
        ci = (ci + 1) % commands.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 70);
  }
  tick();
})();

/* ============================================================
   Rotating job title in hero
   ============================================================ */
(function roleSwap() {
  const el = document.getElementById("role-swap");
  if (!el) return;
  const roles = ["DevOps Engineer", "Site Reliability Engineer", "Infra Support Engineer"];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % roles.length;
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    setTimeout(() => {
      el.textContent = roles[i];
      el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
  }, 2800);
})();

/* ============================================================
   Scroll reveal for sections
   ============================================================ */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
})();

/* ============================================================
   Animated counters in About stats
   ============================================================ */
(function counters() {
  const nums = document.querySelectorAll(".stat__num");
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = cur;
      }, 30);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach((el) => io.observe(el));
})();

/* ============================================================
   Mobile nav toggle
   ============================================================ */
(function mobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
})();
