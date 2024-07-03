<script lang="ts">
	import '../app.css'

	import { page } from '$app/stores'
</script>

<section class="container mx-3 md:mx-auto my-10">
	<nav class="flex gap-x-4">
		<a
			class="text-blue-600 underline underline-offset-4"
			class:!no-underline={$page.url.pathname === '/'}
			class:text-stone-400={$page.url.pathname === '/'}
			class:cursor-default={$page.url.pathname === '/'}
			href="/"
		>
			Home
		</a>
		<a
			class="text-blue-600 underline underline-offset-4"
			class:!no-underline={$page.url.pathname === '/products'}
			class:text-stone-400={$page.url.pathname === '/products'}
			class:cursor-default={$page.url.pathname === '/products'}
			href="/products"
		>
			All products
		</a>
		<a
			class="text-blue-600 underline underline-offset-4"
			class:!no-underline={$page.url.pathname === '/furniture'}
			class:text-stone-400={$page.url.pathname === '/furniture'}
			class:cursor-default={$page.url.pathname === '/furniture'}
			href="/furniture"
		>
			Furniture
		</a>
	</nav>
	<article class="mt-10">
		<slot />
	</article>
</section>
