/**
 * <%= moduleTitle %><% if (description) { %>
 * <%= description %><% } %><% if (homepage) { %>
 * See {@link <%= homepage %>|<%= homepage %>} <% } %>
 * @module <%= moduleSafeName %><% if (authorName) { %>
 * @author <%= authorName %><% if (authorEmail) { %> <%= authorEmail %><% } -%> <% } %>
 * @license <%= license %>
 */

export default function <%= moduleSafeName %>() {}


// import <%= moduleSafeName %> from './lib/';

// export { <%= moduleSafeName %> as default };
