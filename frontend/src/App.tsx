import { useEffect, useState } from 'react'
import { Text } from '@chakra-ui/react'
import { Router, Route, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { ShareKeys } from './components/ShareKeys'
import Home from './pages/Home'
import GenKey from './pages/GenKey'
import EncryptPage from './pages/Encrypt'
import DecryptPage from './pages/Decrypt'
import Root from './layouts/Root'
import './types.ts'
import PublicKeys from './pages/PublicKeys.tsx'

export async function InitiateStream() {
	// @ts-ignore
	const go = new window.Go()
	await WebAssembly.instantiateStreaming(
		fetch('/enc/assets/main.wasm'),
		go.importObject,
	).then((result) => {
		go.run(result.instance)
	})
}

function RouterSetup() {
	return (
		<Router hook={useHashLocation}>
			<Switch>
				<Route path="/" component={Home} />
				<Route path="/genkey" component={GenKey} />
				<Route path="/encrypt" component={EncryptPage} />
				<Route path="/decrypt/:ciphertext" component={DecryptPage} />
				<Route path="/decrypt" component={DecryptPage} />
				<Route path="/share_keys/:publicKey" component={ShareKeys} />
				<Route path="/share_keys" component={ShareKeys} />
				<Route path="/local_keys" component={PublicKeys} />
				<Route path="*">
					{(params) => (
						<Root>
							<div>
								404, Sorry the page{' '}
								<Text as="span" color="crimson">
									{params['*']}
								</Text>{' '}
								does not exist!
							</div>
						</Root>
					)}
				</Route>
			</Switch>
		</Router>
	)
}

function App() {
	const [wasmLoaded, setWasmLoaded] = useState(false)

	useEffect(() => {
		InitiateStream()
			.then(() => setWasmLoaded(true))
			.catch((err) => console.error(err))
	}, [])

	return (
		<>
			{wasmLoaded ? (
				<RouterSetup />
			) : (
				<Root>
					<h3>Loading wasm...</h3>{' '}
				</Root>
			)}
		</>
	)
}

export default App
