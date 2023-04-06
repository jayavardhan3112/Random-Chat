<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  import { fade } from "svelte/transition";

  let hasError = false;
  let isSuccessVisible = false;
  let username: string;
  let password: string;
  let errMessage = "All the fields are mandatory";

  async function login() {
    try {
      await pb.collection("users").authWithPassword(username, password);
    } catch (err) {
      hasError = true;
      errMessage = err;
    }
  }
  function handleChange(password) {
    if (!password) return true;
    return password.length < 8;
  }
  async function signUp() {
    try {
      const data = {
        username,
        password,
        passwordConfirm: password,
        name: "hi mom!",
      };
      const createdUser = await pb.collection("users").create(data);
      await login();
    } catch (err) {
      hasError = true;
      errMessage = err;
      console.error(err);
    }
  }

  function signOut() {
    pb.authStore.clear();
  }
</script>

{#if $currentUser}
  <p>
    ✨ Signed in as {$currentUser.username}
    <button on:click={signOut}>Sign Out</button>
  </p>
{:else}
  {#if hasError == true}
    <p class="error-alert">{errMessage}</p>
  {:else if isSuccessVisible}
    <p class="error-alert" transition:fade={{ duration: 150 }}>
      Signed in successfully
    </p>
  {/if}
  <form on:submit|preventDefault>
    <input placeholder="Username" type="text" bind:value={username} />
    <input
      placeholder="Password"
      autoComplete="new-password"
      type="password"
      bind:value={password}
    />
    <button disabled={handleChange(password)} on:click={signUp}>Sign Up</button>
    <button disabled={handleChange(password)} on:click={login}>Login</button>
  </form>
{/if}
