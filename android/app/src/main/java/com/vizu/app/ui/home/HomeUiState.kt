package com.vizu.app.ui.home

import com.vizu.app.data.HomeFeedData

sealed interface HomeUiState {
    object Idle : HomeUiState
    object Loading : HomeUiState
    data class Success(val data: HomeFeedData) : HomeUiState
    data class Error(val message: String) : HomeUiState
}
