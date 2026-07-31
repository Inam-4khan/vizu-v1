package com.vizu.app.ui.home

import com.vizu.app.data.HomeFeedData
import com.vizu.app.data.HomeFeedItem
import com.vizu.app.data.HomeRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

/**
 * Unit tests for HomeViewModel on Android
 * Using JUnit4 and kotlinx-coroutines-test
 */
@OptIn(ExperimentalCoroutinesApi::class)
class HomeViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    @Test
    fun loadHomeData_transitions_through_Loading_then_Success_state() = runTest {
        // Arrange: Fake Repository returning success data
        val expectedData = HomeFeedData(
            items = listOf(
                HomeFeedItem("1", "Vizu Spatial Post", "Persona_1", "1m ago")
            ),
            userPersona = "Vizu Explorer"
        )
        val fakeRepository = FakeHomeRepository(result = Result.success(expectedData))
        val viewModel = HomeViewModel(fakeRepository)

        // Verify initial state
        assertEquals(HomeUiState.Idle, viewModel.uiState.value)

        // Act: Invoke loadHomeData()
        viewModel.loadHomeData()

        // Assert: ViewModel state transitioned to Success containing expected data
        val state = viewModel.uiState.value
        assertTrue("Expected Success state, but was $state", state is HomeUiState.Success)
        val successState = state as HomeUiState.Success
        assertEquals(expectedData, successState.data)
        assertEquals(1, fakeRepository.callCount)
    }

    @Test
    fun loadHomeData_transitions_to_Error_state_when_repository_throws() = runTest {
        // Arrange: Fake Repository configured to throw Network Exception
        val errorMessage = "Unable to connect to Vizu server"
        val fakeRepository = FakeHomeRepository(
            result = Result.failure(RuntimeException(errorMessage))
        )
        val viewModel = HomeViewModel(fakeRepository)

        // Act: Invoke loadHomeData()
        viewModel.loadHomeData()

        // Assert: ViewModel state transitioned to Error with expected message
        val state = viewModel.uiState.value
        assertTrue("Expected Error state, but was $state", state is HomeUiState.Error)
        val errorState = state as HomeUiState.Error
        assertEquals(errorMessage, errorState.message)
    }
}

/**
 * Fake implementation of HomeRepository for isolated Kotlin Coroutine unit testing
 */
class FakeHomeRepository(
    private val result: Result<HomeFeedData>
) : HomeRepository {
    var callCount = 0
        private set

    override suspend fun getHomeData(): HomeFeedData {
        callCount++
        return result.getOrThrow()
    }
}
