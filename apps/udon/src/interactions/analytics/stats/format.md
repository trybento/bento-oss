# Format for stat loaders

Stat helpers are built in a way that can be used by bulk loaders, so they can be called from within loaders and out of them. As such they should take in an array of requested IDs and return a list of ids mapped to the requested data

For many of them, they were previously single queries which are understood to be more efficient, but became very hard to manage and track.

Use adapter helper to create single load versions

Transaction support explicitly not added because we shouldn't need those in large analytics pulls that are supposed to not modify data
