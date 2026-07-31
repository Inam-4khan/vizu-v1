package com.vizu.app.data

data class HomeFeedItem(
    val id: String,
    val title: String,
    val author: String,
    val timestamp: String
)

data class HomeFeedData(
    val items: List<HomeFeedItem>,
    val userPersona: String
)
