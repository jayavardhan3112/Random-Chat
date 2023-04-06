<script lang="ts">
  import Login from "./lib/Login.svelte";
  import Messages from "./lib/Messages.svelte";
  import { currentUser } from "./lib/pocketbase";
  import Button from "./lib/Button.svelte";
  import SiteThemeToggle from "./lib/SiteThemeToggle.svelte";
  // Set the right color mode based on the user's preferred color scheme.
  const darkMode = sessionStorage.getItem("darkMode");
  if (null !== darkMode) {
    document.body.classList.add(darkMode === "true" ? "dark" : "light");
  }
</script>

<div class="dark-mode">
  <SiteThemeToggle />
</div>

<h1>Random Chat</h1>
<Login />

{#if $currentUser}
  <Messages />
{/if}

<style>
  .dark-mode {
    text-align: right;
  }
</style>
