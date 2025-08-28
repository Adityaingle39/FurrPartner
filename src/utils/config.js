const config = {
    keys: {
        user: 'USER',
        welcome: 'WELCOMESCREEN',
    },
    vetServiceOptions: [
        {
            id: 'online',
            name: 'Online',
        },
        {
            id: 'offline',
            name: 'Offline',
        },
        {
            id: 'home_visit',
            name: 'Home Visit',
        },
    ],
    variables: {
        platformFee: {"type": "%", "value": 10},
        videoCallFee: {"type": "$", "value": 20},
        appointment: JSON.stringify({"complete": {"before": 5, "after": 60}, "videoCall": {"before": 5, "after": 0}}),
        helpCenterEmail: 'support@furrcrew.com',
        helpCenterPhone: '+919067225552',
    }
}

export default config;