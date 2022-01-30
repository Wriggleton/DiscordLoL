function getRelevantRoleStats(participant) {
    switch (participant.individualPosition) {
        case "UTILITY":
            return `**${participant.visionScore}** vision score: 
                    **${participant.wardsPlaced}** ward(s) placed, **${participant.wardsKilled}** ward(s) killed, **${participant.detectorWardsPlaced}** control ward(s) placed`;
        case "BOTTOM":
            return `**${participant.totalDamageDealt}** total damage dealt (**${participant.totalDamageDealtToChampions}** to champions)`;
        case "JUNGLE":
            return `**${participant.dragonKills}** dragon(s) killed, **${participant.baronKills}** baron kill(s), **${participant.neutralMinionsKilled}** monster(s) killed`;
        case "MIDDLE":
            return "Mid";
        case "TOP":
            return "Top";
        default:
            return role;
    }
}

module.exports = {
    getRelevantRoleStats
};