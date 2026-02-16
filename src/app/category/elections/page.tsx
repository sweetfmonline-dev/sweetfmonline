"use client";

import { useState } from "react";
import Image from "next/image";
import { Vote, Trophy, Users, TrendingUp } from "lucide-react";

interface Candidate {
  name: string;
  party: string;
  partyAbbr: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
  color: string;
  photo?: string;
}

interface Election {
  year: number;
  round: string;
  totalValidVotes: number;
  totalRegisteredVoters: number;
  turnoutPercentage: number;
  candidates: Candidate[];
}

const elections: Election[] = [
  {
    year: 2024,
    round: "Presidential Election",
    totalValidVotes: 9_107_873,
    totalRegisteredVoters: 18_774_159,
    turnoutPercentage: 60.78,
    candidates: [
      { name: "John Dramani Mahama", party: "National Democratic Congress", partyAbbr: "NDC", votes: 6_328_397, percentage: 56.55, isWinner: true, color: "#008751", photo: "/candidates/mahama.jpg" },
      { name: "Dr. Mahamudu Bawumia", party: "New Patriotic Party", partyAbbr: "NPP", votes: 4_657_304, percentage: 41.61, isWinner: false, color: "#0033A0", photo: "/candidates/bawumia.jpg" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 205_747, percentage: 1.84, isWinner: false, color: "#999999" },
    ],
  },
  {
    year: 2020,
    round: "Presidential Election",
    totalValidVotes: 13_434_574,
    totalRegisteredVoters: 17_027_655,
    turnoutPercentage: 79.0,
    candidates: [
      { name: "Nana Addo Dankwa Akufo-Addo", party: "New Patriotic Party", partyAbbr: "NPP", votes: 6_730_413, percentage: 51.30, isWinner: true, color: "#0033A0", photo: "/candidates/akufo-addo.jpg" },
      { name: "John Dramani Mahama", party: "National Democratic Congress", partyAbbr: "NDC", votes: 6_214_889, percentage: 47.36, isWinner: false, color: "#008751", photo: "/candidates/mahama.jpg" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 489_272, percentage: 1.34, isWinner: false, color: "#999999" },
    ],
  },
  {
    year: 2016,
    round: "Presidential Election",
    totalValidVotes: 10_635_736,
    totalRegisteredVoters: 15_712_499,
    turnoutPercentage: 68.62,
    candidates: [
      { name: "Nana Addo Dankwa Akufo-Addo", party: "New Patriotic Party", partyAbbr: "NPP", votes: 5_716_026, percentage: 53.72, isWinner: true, color: "#0033A0", photo: "/candidates/akufo-addo.jpg" },
      { name: "John Dramani Mahama", party: "National Democratic Congress", partyAbbr: "NDC", votes: 4_713_277, percentage: 44.40, isWinner: false, color: "#008751", photo: "/candidates/mahama.jpg" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 206_433, percentage: 1.88, isWinner: false, color: "#999999" },
    ],
  },
  {
    year: 2012,
    round: "Presidential Election",
    totalValidVotes: 10_995_262,
    totalRegisteredVoters: 14_158_890,
    turnoutPercentage: 79.43,
    candidates: [
      { name: "John Dramani Mahama", party: "National Democratic Congress", partyAbbr: "NDC", votes: 5_574_761, percentage: 50.70, isWinner: true, color: "#008751", photo: "/candidates/mahama.jpg" },
      { name: "Nana Addo Dankwa Akufo-Addo", party: "New Patriotic Party", partyAbbr: "NPP", votes: 5_248_898, percentage: 47.74, isWinner: false, color: "#0033A0", photo: "/candidates/akufo-addo.jpg" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 171_603, percentage: 1.56, isWinner: false, color: "#999999" },
    ],
  },
  {
    year: 2008,
    round: "Presidential Run-off",
    totalValidVotes: 9_001_478,
    totalRegisteredVoters: 12_472_758,
    turnoutPercentage: 72.91,
    candidates: [
      { name: "Prof. John Evans Atta Mills", party: "National Democratic Congress", partyAbbr: "NDC", votes: 4_521_032, percentage: 50.23, isWinner: true, color: "#008751", photo: "/candidates/atta-mills.jpg" },
      { name: "Nana Addo Dankwa Akufo-Addo", party: "New Patriotic Party", partyAbbr: "NPP", votes: 4_480_446, percentage: 49.77, isWinner: false, color: "#0033A0", photo: "/candidates/akufo-addo.jpg" },
    ],
  },
  {
    year: 2004,
    round: "Presidential Election",
    totalValidVotes: 8_069_913,
    totalRegisteredVoters: 10_354_970,
    turnoutPercentage: 85.12,
    candidates: [
      { name: "John Agyekum Kufuor", party: "New Patriotic Party", partyAbbr: "NPP", votes: 4_524_074, percentage: 52.45, isWinner: true, color: "#0033A0", photo: "/candidates/kufuor.jpg" },
      { name: "Prof. John Evans Atta Mills", party: "National Democratic Congress", partyAbbr: "NDC", votes: 3_266_349, percentage: 44.64, isWinner: false, color: "#008751", photo: "/candidates/atta-mills.jpg" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 279_490, percentage: 2.91, isWinner: false, color: "#999999" },
    ],
  },
  {
    year: 2000,
    round: "Presidential Run-off",
    totalValidVotes: 6_605_084,
    totalRegisteredVoters: 10_698_652,
    turnoutPercentage: 60.97,
    candidates: [
      { name: "John Agyekum Kufuor", party: "New Patriotic Party", partyAbbr: "NPP", votes: 3_631_263, percentage: 56.90, isWinner: true, color: "#0033A0", photo: "/candidates/kufuor.jpg" },
      { name: "Prof. John Evans Atta Mills", party: "National Democratic Congress", partyAbbr: "NDC", votes: 2_750_124, percentage: 43.10, isWinner: false, color: "#008751", photo: "/candidates/atta-mills.jpg" },
    ],
  },
  {
    year: 1996,
    round: "Presidential Election",
    totalValidVotes: 7_253_027,
    totalRegisteredVoters: 9_279_605,
    turnoutPercentage: 78.16,
    candidates: [
      { name: "Jerry John Rawlings", party: "National Democratic Congress", partyAbbr: "NDC", votes: 4_099_760, percentage: 57.37, isWinner: true, color: "#008751", photo: "/candidates/rawlings.jpg" },
      { name: "John Agyekum Kufuor", party: "New Patriotic Party", partyAbbr: "NPP", votes: 2_834_878, percentage: 39.68, isWinner: false, color: "#0033A0", photo: "/candidates/kufuor.jpg" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 318_389, percentage: 2.95, isWinner: false, color: "#999999" },
    ],
  },
  {
    year: 1992,
    round: "Presidential Election",
    totalValidVotes: 3_922_280,
    totalRegisteredVoters: 8_228_461,
    turnoutPercentage: 50.16,
    candidates: [
      { name: "Jerry John Rawlings", party: "National Democratic Congress", partyAbbr: "NDC", votes: 2_326_779, percentage: 58.40, isWinner: true, color: "#008751", photo: "/candidates/rawlings.jpg" },
      { name: "Prof. Albert Adu Boahen", party: "New Patriotic Party", partyAbbr: "NPP", votes: 1_204_764, percentage: 30.29, isWinner: false, color: "#0033A0" },
      { name: "Others", party: "Other Candidates", partyAbbr: "Others", votes: 390_737, percentage: 11.31, isWinner: false, color: "#999999" },
    ],
  },
];

const electionYears = elections.map((e) => e.year);

function formatNumber(n: number): string {
  return n.toLocaleString("en-GH");
}

export default function ElectionsPage() {
  const [selectedYear, setSelectedYear] = useState(electionYears[0]);
  const election = elections.find((e) => e.year === selectedYear)!;
  const winner = election.candidates.find((c) => c.isWinner)!;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-charcoal to-charcoal-light text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center gap-3 mb-2">
            <Vote className="w-7 h-7 text-sweet-red" />
            <h1 className="text-2xl lg:text-4xl font-bold">Elections Centre</h1>
          </div>
          <p className="text-gray-300 text-sm lg:text-base max-w-2xl">
            Ghana Presidential Election Results — from the dawn of the Fourth Republic in 1992 to the present day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
        {/* Year Selector */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Election Year</h2>
          <div className="flex flex-wrap gap-2">
            {electionYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  selectedYear === year
                    ? "bg-sweet-red text-white shadow-lg shadow-sweet-red/25 scale-105"
                    : "bg-white text-charcoal border border-gray-200 hover:border-sweet-red hover:text-sweet-red"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Election Info */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-charcoal">
            {election.year} {election.round}
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              <span>Registered Voters</span>
            </div>
            <p className="text-2xl font-bold text-charcoal">{formatNumber(election.totalRegisteredVoters)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Vote className="w-4 h-4" />
              <span>Total Valid Votes</span>
            </div>
            <p className="text-2xl font-bold text-charcoal">{formatNumber(election.totalValidVotes)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Voter Turnout</span>
            </div>
            <p className="text-2xl font-bold text-charcoal">{election.turnoutPercentage}%</p>
          </div>
        </div>

        {/* Winner Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-semibold uppercase tracking-wide text-green-200">Winner</span>
          </div>
          <div className="flex items-center gap-5">
            {winner.photo && (
              <Image
                src={winner.photo}
                alt={winner.name}
                width={100}
                height={100}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white/30 flex-shrink-0"
              />
            )}
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-1">{winner.name}</h3>
              <p className="text-green-100 text-sm mb-3">
                {winner.party} ({winner.partyAbbr})
              </p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-green-200 text-xs uppercase">Votes</p>
                  <p className="text-xl font-bold">{formatNumber(winner.votes)}</p>
                </div>
                <div>
                  <p className="text-green-200 text-xs uppercase">Percentage</p>
                  <p className="text-xl font-bold">{winner.percentage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Candidates */}
        <h3 className="text-lg font-bold text-charcoal mb-4">All Candidates</h3>
        <div className="space-y-4">
          {election.candidates.map((candidate) => (
            <div
              key={candidate.name}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
                candidate.isWinner ? "border-green-300 ring-1 ring-green-200" : "border-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {candidate.photo ? (
                    <Image
                      src={candidate.photo}
                      alt={candidate.name}
                      width={56}
                      height={56}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 flex-shrink-0"
                      style={{ borderColor: candidate.color }}
                    />
                  ) : (
                    <div
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: candidate.color }}
                    >
                      {candidate.partyAbbr.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-charcoal flex items-center gap-2">
                      {candidate.name}
                      {candidate.isWinner && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          WINNER
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {candidate.party} ({candidate.partyAbbr})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Votes</p>
                    <p className="text-lg font-bold text-charcoal">{formatNumber(candidate.votes)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Share</p>
                    <p className="text-lg font-bold text-charcoal">{candidate.percentage}%</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${candidate.percentage}%`,
                    backgroundColor: candidate.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Source */}
        <p className="text-xs text-gray-400 mt-8 text-center">
          Source: Electoral Commission of Ghana. Figures are approximate and based on officially declared results.
        </p>
      </div>
    </div>
  );
}
