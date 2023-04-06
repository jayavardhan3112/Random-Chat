<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { currentUser, pb } from "./pocketbase";

  let newMessage: string;
  let messages = [];
  let unsubscribe: () => void;
  let element;
  const scrollToBottom = async (node) => {
    console.log("node");
    console.log(node.scrollHeight + 1);
    node.scroll({ top: node.scrollHeight + 100, behavior: "smooth" });
  };

  afterUpdate(() => {
    console.log("afterUpdate");
    if (messages) scrollToBottom(element);
  });

  onMount(async () => {
    // Get initial messages
    const resultList = await pb.collection("messages").getList(1, 50, {
      sort: "created",
      expand: "user",
    });
    messages = resultList.items;

    // Subscribe to realtime messages
    unsubscribe = await pb
      .collection("messages")
      .subscribe("*", async ({ action, record }) => {
        if (action === "create") {
          // Fetch associated user
          const user = await pb.collection("users").getOne(record.user);
          record.expand = { user };
          messages = [...messages, record];
        }
        if (action === "delete") {
          messages = messages.filter((m) => m.id !== record.id);
        }
      });
  });

  // Unsubscribe from realtime messages
  onDestroy(() => {
    unsubscribe?.();
  });

  async function sendMessage() {
    const data = {
      text: newMessage,
      user: $currentUser.id,
    };
    const createdMessage = await pb.collection("messages").create(data);
    scrollToBottom(element);
    newMessage = "";
  }
</script>

<div
  bind:this={element}
  class="messages"
  style="overflow:scroll; height:400px;"
>
  {#each messages as message (message.id)}
    <div class="msg" style="display: flex; align-items: center;">
      <img
        class="avatar"
        src={`https://avatars.dicebear.com/api/adventurer/${message.expand?.user?.username}.svg`}
        alt="avatar"
        width="40px"
      />
      <div class="content" style="align-items: center;">
        <small>
          Sent by @{message.expand?.user?.username}
        </small>
        <p class="msg-text" style="display: flex">{message.text}</p>
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit">Send</button>
</form>
