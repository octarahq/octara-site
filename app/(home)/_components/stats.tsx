"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Stats() {
  const [stars, setStars] = useState<number | null>(null);
  const [repos, setRepos] = useState<number | null>(null);
  const [projectsCount, setProjectsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const orgRes = await fetch("https://api.github.com/users/octarahq");
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          setRepos(orgData.public_repos);
        }

        const reposRes = await fetch(
          "https://api.github.com/users/octarahq/repos?per_page=100",
        );
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          const totalStars = reposData.reduce(
            (
              acc: number,
              repo: {
                stargazers_count: number;
              },
            ) => acc + repo.stargazers_count,
            0,
          );
          setStars(totalStars);
        }

        const projectsRes = await fetch("/api/v1/projects");
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (Array.isArray(projectsData)) {
            const publicProjects = projectsData.filter((p: { is_public: boolean }) => p.is_public);
            setProjectsCount(publicProjects.length);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Active Projects",
      value: projectsCount !== null ? `${projectsCount}` : "...",
      description: "innovative initiatives currently in development",
    },
    {
      title: "Community Love",
      value: stars !== null ? `${stars}` : "...",
      description: "stars across our open-source repositories",
    },
    {
      title: "Open Source",
      value: repos !== null ? `${repos}` : "...",
      description: "public repositories available on GitHub",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12 md:mt-24">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-[#242424] rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[220px]"
        >
          <div className="text-zinc-300 text-[15px]">{stat.title}</div>
          <div>
            <div className="text-white text-6xl md:text-7xl font-bold tracking-tight mb-2">
              {stat.value}
            </div>
            <div className="text-zinc-200 text-base">{stat.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
