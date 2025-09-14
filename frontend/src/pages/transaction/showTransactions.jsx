import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApi, deleteApi } from "../../api";
import TransactionTable from "../../components/transaction/transactionTable";
import TransactionSearchForm from "../../components/transaction/transactionHeader";
import { Pagination } from "../../components/ui/pagination";


const ShowTotalAmounts = ({totalIncome, totalExpense, totalProfit}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between m-2 gap-2">
            <p className="text-lg font-semibold px-4 py-6 bg-white flex-1 rounded-lg">Total Income:  <span className="text-green-500">{totalIncome}</span></p>
            <p className="text-lg font-semibold px-4 py-6 bg-white flex-1 rounded-lg">Total Expense: <span className="text-red-500">{totalExpense}</span></p>
            <p className="text-lg font-semibold px-4 py-6 bg-white flex-1 rounded-lg">Total Profit:  <span className="text-blue-500">{totalProfit}</span></p>
        </div>
    );
}

export default function Transaction() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState({});
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState({
        from: null,
        to: null,
        search: ""
    })
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['transactions', page, searchQuery],
        queryFn: () => getApi('getTransactions', { page }),
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const handleDelete = async (id) => {
        try {
            await deleteApi(`deleteTransaction/${id}`);
            refetch();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await getApi('searchTransactions', { ...search });
            setSearchResult(response)
        } catch (error) {
            console.error('Error searching transactions:', error);
        }
    };
    const transactions = data?.transactions || [];
    const totalPages = data?.totalPages || 1;
    console.log(totalPages);
    
    return (
        <div>
            <TransactionSearchForm handleSearch={handleSearch} search={search} setSearch={setSearch} />


            {
                search.to || search.from || search.search ? (
                    <ShowTotalAmounts totalIncome={searchResult?.totalIncome} totalExpense={searchResult?.totalExpense} totalProfit={searchResult?.totalProfit} />
                ) : (
                    <ShowTotalAmounts totalIncome={data?.totalIncome} totalExpense={data?.totalExpense} totalProfit={data?.totalProfit} />
                )
            }

            {
                search.to || search.from || search.search ? (
                    <TransactionTable orders={searchResult.transactions} onDeleteOrder={handleDelete} />
                ) : (
                    <TransactionTable orders={transactions} onDeleteOrder={handleDelete} />
                )
            }


            {/* Only show pagination when not searching */}
            {!(search.to || search.from || search.search) && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}