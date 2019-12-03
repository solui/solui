solUI interfaces are deterministically generated from a declarative
specification. Furthermore, the underlying parsing and rendering engine is
platform agnostic.

Here are the key benefits that are realized as a result of this:

* **UI look and feel is consistent across platforms and contracts**
  * All UIs can have a consistent look-and-feel.
  * No front-end programming skills required since spec is more akin to a template.
  * The spec can be checked into version control and thus evolve alongside the contract code.
* **Specification sits at a higher level than an ABI, abstracting away ugly details**
  * User-friendly labels, text and images makes things intuitive for the user.
  * A single execution can involve calls to multiple methods across multiple contracts.
  * Output from earlier method calls can be automatically be re-used as inputs to later calls.
* **Platform-agnostic rendering, validation and testing**
  * Platform-agnostic (can render to web, mobile, desktop, ...).
  * Headless execution is also supported, making [UI testing](../../Processor/HeadlessExecution) a breeze.
  * Validate user input (e.g. contract addresses) with on-chain data checking.
* **Online repository for easy publishing and hosting**
  * [Publishing system](../../Publishing) to enable developers to share their UIs with a wider audience.
  * Users can search for and immediately use UIs within their Dapp browsers.
  * Client API to allow other tools in the wider ecosystem to fetch UI specs and render them locally.

And further improvements are on the way, as outlined in the [roadmap](../Roadmap).
