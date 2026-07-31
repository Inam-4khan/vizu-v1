package com.vizu.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vizu.app.model.data.HomeFeedData
import com.vizu.app.repository.HomeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * UI State for the Vizu Home screen.
 */
sealed interface UiState {
    data object Loading : UiState
    data class Success(val feedData: HomeFeedData) : UiState
    data class Error(val message: String) : UiState
}

/**
 * ViewModel responsible for managing state and business logic for the Home screen.
 */
class HomeViewModel(
    private val repository: HomeRepository = HomeRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        loadHomeData()
    }

    /**
     * Coroutine function to load home feed data from repository.
     */
    fun loadHomeData(forceRefresh: Boolean = false) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            repository.getHomeFeed(forceRefresh)
                .onSuccess { data ->
                    _uiState.value = UiState.Success(data)
                }
                .onFailure { exception ->
                    _uiState.value = UiState.Error(
                        exception.localizedMessage ?: "Failed to connect to Vizu network. Please try again."
                    )
                }
        }
    }

    /**
     * Toggle Zap reaction on a post.
     */
    fun toggleZap(postId: String) {
        viewModelScope.launch {
            repository.toggleZap(postId)
                .onSuccess { updatedData ->
                    _uiState.value = UiState.Success(updatedData)
                }
                .onFailure {
                    // Retain state or log error
                }
        }
    }
}
