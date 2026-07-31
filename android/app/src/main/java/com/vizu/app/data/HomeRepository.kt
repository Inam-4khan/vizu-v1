package com.vizu.app.data

interface HomeRepository {
    suspend fun getHomeData(): HomeFeedData
}

class DefaultHomeRepository : HomeRepository {
    override suspend fun getHomeData(): HomeFeedData {
        // Simulated network fetch
        return HomeFeedData(
            items = listOf(
                HomeFeedItem("1", "Welcome to Vizu", "System", "Just now"),
                HomeFeedItem("2", "AR Vista Feed Initialized", "Persona AI", "1m ago")
            ),
            userPersona = "Vizu Explorer"
        )
    }
}
