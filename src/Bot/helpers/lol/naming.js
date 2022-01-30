function properRole(role) {
    switch (role) {
        case "UTILITY":
            return "Support";
        case "BOTTOM":
            return "ADC";
        case "JUNGLE":
            return "Jungle";
        case "MIDDLE":
            return "Mid";
        case "TOP":
            return "Top";
        default:
            return role;
    }
}

module.exports = {
    properRole
}